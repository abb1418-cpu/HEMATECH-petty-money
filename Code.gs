/*************************************************************
 * نظام إدارة العهد المالية - Hema Tech Petty Cash
 * خلفية Google Apps Script (قاعدة بيانات Google Sheets)
 * Powered by Mawarid
 *
 * طريقة الاستخدام:
 *  1) شغّل الدالة setup() مرة واحدة من المحرر لإنشاء الجداول والبيانات الأولية.
 *  2) انشر المشروع: Deploy > New deployment > Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  3) انسخ رابط الـ Web App والصقه في شاشة "الإعدادات" داخل التطبيق.
 *************************************************************/

// إذا تركت القيمة فارغة سيستخدم السكربت الجدول المرتبط به تلقائياً.
// أو ضع معرّف الجدول هنا مباشرة:
var SPREADSHEET_ID = '1uREspJqXrHmA4beZQYFNBQK2DxHIpUXUHr-fLKAGHUI';

/** ===== أسماء الأوراق (Sheets) ===== */
var SHEETS = {
  USERS:     'Users',
  CUSTODY:   'Custody',
  EXPENSES:  'Expenses',
  TRANSFERS: 'Transfers',
  AUDIT:     'AuditLog'
};

/** ===== رؤوس الأعمدة لكل ورقة ===== */
var HEADERS = {
  Users:     ['ID', 'Name', 'Role', 'Email', 'Password'],
  Custody:   ['ID', 'Name', 'Balance', 'Pending', 'Transit'],
  Expenses:  ['ID', 'Date', 'Holder', 'Category', 'Amount', 'Description', 'Status', 'Vehicle', 'Odometer', 'CreatedAt'],
  Transfers: ['ID', 'Date', 'Sender', 'Recipient', 'Amount', 'Status', 'CreatedAt'],
  AuditLog:  ['Timestamp', 'User', 'Action', 'Details']
};

/* =====================================================================
 * نقطة الدخول للقراءة (GET) — يعيد كل البيانات أو يتحقق من الاتصال
 * ===================================================================== */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'getAll';

    if (action === 'ping') {
      return jsonOut({ ok: true, status: 'online', time: new Date().toISOString() });
    }

    if (action === 'getAll') {
      return jsonOut({
        ok: true,
        users:     readSheet(SHEETS.USERS),
        custody:   readSheet(SHEETS.CUSTODY),
        expenses:  readSheet(SHEETS.EXPENSES),
        transfers: readSheet(SHEETS.TRANSFERS)
      });
    }

    return jsonOut({ ok: false, error: 'إجراء غير معروف: ' + action });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/* =====================================================================
 * نقطة الدخول للكتابة (POST) — تنفيذ العمليات المالية
 * ===================================================================== */
function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    var action = body.action;
    var lock = LockService.getScriptLock();
    lock.waitLock(20000); // منع الكتابة المتزامنة

    var result;
    switch (action) {
      case 'login':            result = login(body); break;
      case 'addExpense':       result = addExpense(body); break;
      case 'approveExpense':   result = setExpenseStatus(body, 'Approved'); break;
      case 'rejectExpense':    result = setExpenseStatus(body, 'Rejected'); break;
      case 'addTransfer':      result = addTransfer(body); break;
      case 'confirmTransfer':  result = confirmTransfer(body); break;
      case 'rechargeCustody':  result = rechargeCustody(body); break;
      default:                 result = { ok: false, error: 'إجراء غير معروف: ' + action };
    }

    lock.releaseLock();
    return jsonOut(result);
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/* =====================================================================
 * العمليات (Business Logic)
 * ===================================================================== */

// تسجيل الدخول: يطابق البريد/الدور ويعيد بيانات المستخدم (بدون كلمة المرور)
function login(body) {
  var email = String(body.email || '').toLowerCase().trim();
  var users = readSheet(SHEETS.USERS);
  var found = users.filter(function (u) {
    return String(u.Email).toLowerCase() === email ||
           String(u.Role).toLowerCase() === email;
  })[0];

  if (!found) return { ok: false, error: 'بيانات الدخول غير صحيحة' };

  // ملاحظة: هذه نسخة مبسطة بدون تشفير. للإنتاج فعّل تحقق كلمة المرور.
  audit(found.Name, 'LOGIN', 'تسجيل دخول');
  return {
    ok: true,
    user: { id: found.ID, name: found.Name, role: found.Role, email: found.Email }
  };
}

// إضافة مصروف جديد
function addExpense(body) {
  var sh = sheet(SHEETS.EXPENSES);
  var id = 'EXP-' + nextSeq(sh);
  var row = {
    ID: id,
    Date: body.date,
    Holder: body.holder,
    Category: body.category,
    Amount: Number(body.amount),
    Description: body.desc,
    Status: body.status || 'Pending Finance Approval',
    Vehicle: body.vehicle || '',
    Odometer: body.odo || '',
    CreatedAt: new Date().toISOString()
  };
  appendRow(SHEETS.EXPENSES, row);

  // تحديث المصروفات غير المعتمدة في رصيد العهدة
  adjustCustody(body.holder, { pending: Number(body.amount) });

  audit(body.holder, 'ADD_EXPENSE', id + ' بمبلغ ' + body.amount);
  return { ok: true, id: id, expense: row };
}

// اعتماد أو رفض مصروف
function setExpenseStatus(body, newStatus) {
  var info = findRow(SHEETS.EXPENSES, 'ID', body.id);
  if (!info) return { ok: false, error: 'المصروف غير موجود' };

  setCell(SHEETS.EXPENSES, info.rowIndex, 'Status', newStatus);

  var amount = Number(info.data.Amount);
  var holder = info.data.Holder;

  if (newStatus === 'Approved') {
    // يُخصم المبلغ من الرصيد المتاح ويُزال من المعلق
    adjustCustody(holder, { balance: -amount, pending: -amount });
  } else if (newStatus === 'Rejected') {
    // يُزال من المعلق فقط
    adjustCustody(holder, { pending: -amount });
  }

  audit('System', newStatus === 'Approved' ? 'APPROVE_EXPENSE' : 'REJECT_EXPENSE', body.id);
  return { ok: true, id: body.id, status: newStatus };
}

// إنشاء تحويل جديد (من المالية إلى صاحب عهدة)
function addTransfer(body) {
  var sh = sheet(SHEETS.TRANSFERS);
  var id = 'TRN-' + nextSeq(sh);
  var amount = Number(body.amount);
  var row = {
    ID: id,
    Date: body.date || new Date().toISOString().split('T')[0],
    Sender: body.sender || 'Finance',
    Recipient: body.recipient,
    Amount: amount,
    Status: 'Awaiting Recipient Confirmation',
    CreatedAt: new Date().toISOString()
  };
  appendRow(SHEETS.TRANSFERS, row);

  // المبلغ يصبح "نقد في الطريق" حتى يؤكد المستلم
  adjustCustody(body.recipient, { transit: amount });

  audit(body.sender || 'Finance', 'ADD_TRANSFER', id + ' إلى ' + body.recipient);
  return { ok: true, id: id, transfer: row };
}

// تأكيد استلام التحويل من قبل المستلم
function confirmTransfer(body) {
  var info = findRow(SHEETS.TRANSFERS, 'ID', body.id);
  if (!info) return { ok: false, error: 'التحويل غير موجود' };
  if (info.data.Status === 'Received') return { ok: false, error: 'تم تأكيد هذا التحويل مسبقاً' };

  setCell(SHEETS.TRANSFERS, info.rowIndex, 'Status', 'Received');

  var amount = Number(info.data.Amount);
  var recipient = info.data.Recipient;
  // ينتقل المبلغ من "في الطريق" إلى "الرصيد المتاح"
  adjustCustody(recipient, { balance: amount, transit: -amount });

  audit(recipient, 'CONFIRM_TRANSFER', body.id);
  return { ok: true, id: body.id, status: 'Received' };
}

// شحن / تغذية عهدة مباشرة (إجراء مالي)
function rechargeCustody(body) {
  var amount = Number(body.amount);
  adjustCustody(body.name, { balance: amount });
  audit(body.by || 'Finance', 'RECHARGE', body.name + ' بمبلغ ' + amount);
  return { ok: true, name: body.name, amount: amount };
}

/* =====================================================================
 * أدوات مساعدة للجداول
 * ===================================================================== */

function ss() {
  return SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID)
                        : SpreadsheetApp.getActiveSpreadsheet();
}

function sheet(name) {
  var s = ss().getSheetByName(name);
  if (!s) {
    s = ss().insertSheet(name);
    s.appendRow(HEADERS[name]);
  }
  return s;
}

// قراءة ورقة كاملة كمصفوفة كائنات
function readSheet(name) {
  var s = sheet(name);
  var values = s.getDataRange().getValues();
  if (values.length < 2) return [];
  var head = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var c = 0; c < head.length; c++) obj[head[c]] = values[i][c];
    if (String(obj[head[0]]).length) rows.push(obj);
  }
  return rows;
}

function appendRow(name, obj) {
  var s = sheet(name);
  var head = HEADERS[name];
  var line = head.map(function (h) { return obj[h] !== undefined ? obj[h] : ''; });
  s.appendRow(line);
}

// البحث عن صف بقيمة عمود معيّن
function findRow(name, col, value) {
  var s = sheet(name);
  var values = s.getDataRange().getValues();
  var head = values[0];
  var cIdx = head.indexOf(col);
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][cIdx]) === String(value)) {
      var obj = {};
      for (var c = 0; c < head.length; c++) obj[head[c]] = values[i][c];
      return { rowIndex: i + 1, data: obj };
    }
  }
  return null;
}

function setCell(name, rowIndex, col, value) {
  var s = sheet(name);
  var cIdx = HEADERS[name].indexOf(col) + 1;
  s.getRange(rowIndex, cIdx).setValue(value);
}

// تعديل قيم عهدة بإضافة/طرح (delta) مع ضمان عدم النزول تحت الصفر للحقول المعلّقة
function adjustCustody(name, deltas) {
  var info = findRow(SHEETS.CUSTODY, 'Name', name);
  if (!info) return;
  var fields = { balance: 'Balance', pending: 'Pending', transit: 'Transit' };
  for (var key in deltas) {
    var col = fields[key];
    if (!col) continue;
    var current = Number(info.data[col]) || 0;
    var updated = current + Number(deltas[key]);
    if (key !== 'balance') updated = Math.max(0, updated); // المعلّق والترانزيت لا ينزل تحت الصفر
    setCell(SHEETS.CUSTODY, info.rowIndex, col, updated);
    info.data[col] = updated;
  }
}

// رقم تسلسلي تالي بناءً على عدد الصفوف
function nextSeq(s) {
  return (s.getLastRow()) + Math.floor(Math.random() * 90 + 10);
}

function audit(user, action, details) {
  appendRow(SHEETS.AUDIT, {
    Timestamp: new Date().toISOString(),
    User: user,
    Action: action,
    Details: details
  });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* =====================================================================
 * الإعداد الأولي — شغّلها مرة واحدة
 * ===================================================================== */
function setup() {
  // 1) إنشاء كل الأوراق مع رؤوسها
  Object.keys(SHEETS).forEach(function (k) {
    var name = SHEETS[k];
    var s = ss().getSheetByName(name) || ss().insertSheet(name);
    if (s.getLastRow() === 0) s.appendRow(HEADERS[name]);
  });

  // 2) بيانات المستخدمين الأولية (إن كانت فارغة)
  if (readSheet(SHEETS.USERS).length === 0) {
    [
      { ID: 1, Name: 'System Admin',        Role: 'Admin',         Email: 'admin@hema.tech',    Password: '123456' },
      { ID: 2, Name: 'Finance Manager',     Role: 'Finance',       Email: 'finance@hema.tech',  Password: '123456' },
      { ID: 3, Name: 'Abdullah AlTowaijri', Role: 'CustodyHolder', Email: 'abdullah@hema.tech', Password: '123456' },
      { ID: 4, Name: 'PASCAL OBWAVO',       Role: 'CustodyHolder', Email: 'pascal@hema.tech',   Password: '123456' }
    ].forEach(function (u) { appendRow(SHEETS.USERS, u); });
  }

  // 3) حسابات العهد الأولية
  if (readSheet(SHEETS.CUSTODY).length === 0) {
    [
      { ID: 'CUST-001', Name: 'Abdullah AlTowaijri',   Balance: 5000, Pending: 1200, Transit: 0 },
      { ID: 'CUST-002', Name: 'PASCAL OBWAVO',         Balance: 1500, Pending: 0,    Transit: 500 },
      { ID: 'CUST-003', Name: 'JHON JULIUS MONCATAR',  Balance: 350,  Pending: 0,    Transit: 0 }
    ].forEach(function (c) { appendRow(SHEETS.CUSTODY, c); });
  }

  // 4) مصروفات وتحويلات تجريبية (اختياري — احذفها إن أردت بداية نظيفة)
  if (readSheet(SHEETS.EXPENSES).length === 0) {
    appendRow(SHEETS.EXPENSES, { ID: 'EXP-101', Date: '2026-06-20', Holder: 'Abdullah AlTowaijri', Category: 'وقود / ديزل', Amount: 150, Description: 'وقود سيارة العمل', Status: 'Pending Manager Approval', Vehicle: 'ABC-123', Odometer: 125000, CreatedAt: new Date().toISOString() });
    appendRow(SHEETS.EXPENSES, { ID: 'EXP-102', Date: '2026-06-19', Holder: 'PASCAL OBWAVO', Category: 'مواد تكييف', Amount: 450, Description: 'شراء غاز فريون', Status: 'Approved', Vehicle: '', Odometer: '', CreatedAt: new Date().toISOString() });
    appendRow(SHEETS.EXPENSES, { ID: 'EXP-103', Date: '2026-06-18', Holder: 'Abdullah AlTowaijri', Category: 'إصلاح مركبة', Amount: 1200, Description: 'تغيير إطارات', Status: 'Pending Finance Approval', Vehicle: '', Odometer: '', CreatedAt: new Date().toISOString() });
  }
  if (readSheet(SHEETS.TRANSFERS).length === 0) {
    appendRow(SHEETS.TRANSFERS, { ID: 'TRN-201', Date: '2026-06-21', Sender: 'Finance', Recipient: 'PASCAL OBWAVO', Amount: 500, Status: 'Awaiting Recipient Confirmation', CreatedAt: new Date().toISOString() });
    appendRow(SHEETS.TRANSFERS, { ID: 'TRN-202', Date: '2026-06-15', Sender: 'Finance', Recipient: 'Abdullah AlTowaijri', Amount: 5000, Status: 'Received', CreatedAt: new Date().toISOString() });
  }

  SpreadsheetApp.flush();
  Logger.log('تم الإعداد بنجاح. كل الأوراق جاهزة.');
}
