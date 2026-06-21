import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Wallet, ArrowRightLeft, FileText,
  Car, CheckCircle, Settings, Users, History,
  Bell, FileOutput, Upload, AlertTriangle, Check, X,
  Search, Filter, Plus, FileSpreadsheet, Activity,
  Globe, LogOut, Menu, RefreshCw
} from 'lucide-react';

/* ============================================================
   BRANDING & CONSTANTS
============================================================ */
const HEMAH_LOGO = "data:image/webp;base64,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";
const MAWARID_LOGO = "data:image/webp;base64,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";

const STORAGE_KEY = 'hema_gas_url';

/* ============================================================
   API LAYER — Google Apps Script (Google Sheets backend)
============================================================ */
// تحويل صفوف الجداول (مفاتيح كبيرة) إلى صيغة التطبيق (مفاتيح صغيرة)
const mapExpense  = r => ({ id: r.ID, date: r.Date, holder: r.Holder, category: r.Category, amount: Number(r.Amount) || 0, desc: r.Description, status: r.Status, vehicle: r.Vehicle, odo: r.Odometer });
const mapCustody  = r => ({ id: r.ID, name: r.Name, balance: Number(r.Balance) || 0, pending: Number(r.Pending) || 0, transit: Number(r.Transit) || 0 });
const mapTransfer = r => ({ id: r.ID, date: r.Date, sender: r.Sender, recipient: r.Recipient, amount: Number(r.Amount) || 0, status: r.Status });

async function apiGetAll(url) {
  const res = await fetch(url + '?action=getAll', { method: 'GET' });
  return res.json();
}
async function apiPing(url) {
  const res = await fetch(url + '?action=ping', { method: 'GET' });
  return res.json();
}
async function apiPost(url, action, payload = {}) {
  // text/plain يتجنّب طلب preflight ويمنع مشاكل CORS مع Apps Script
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...payload })
  });
  return res.json();
}

/* ============================================================
   TRANSLATIONS & i18n
============================================================ */
const dict = {
  ar: {
    appTitle: "نظام إدارة العهد المالية", appSubtitle: "Hema Tech Petty Cash & Custody Management",
    poweredBy: "بدعم من موارد", login: "تسجيل الدخول", email: "البريد الإلكتروني", password: "كلمة المرور",
    rememberMe: "تذكرني", dashboard: "الرئيسية", expenses: "المصروفات", custody: "العهد المالية",
    transfers: "التحويلات", approvals: "الموافقات", vehicles: "المركبات والوقود", reconciliations: "التسويات",
    reports: "التقارير", settings: "الإعدادات", audit: "سجل العمليات", totalCustody: "إجمالي العهد",
    availableBalance: "الرصيد المتاح", pendingApprovals: "بانتظار الموافقة", pendingTransfers: "تحويلات معلقة",
    addNewExpense: "تسجيل مصروف جديد", expenseDate: "تاريخ الصرف", amount: "المبلغ", category: "التصنيف",
    description: "وصف العملية", submit: "إرسال", cancel: "إلغاء", status: "الحالة", search: "بحث...",
    confirmReceipt: "تأكيد الاستلام", awaitingConfirmation: "بانتظار التأكيد", approved: "معتمد",
    rejected: "مرفوض", syncStatus: "حالة المزامنة", synced: "متصل - Google Sheets",
    offline: "وضع الأوفلاين (نسخة تجريبية)", save: "حفظ", logout: "تسجيل الخروج"
  },
  en: {
    appTitle: "Hema Tech Petty Cash", appSubtitle: "Custody Management System",
    poweredBy: "Powered by Mawarid", login: "Login", email: "Email", password: "Password",
    rememberMe: "Remember me", dashboard: "Dashboard", expenses: "Expenses", custody: "Custody Accounts",
    transfers: "Transfers", approvals: "Approvals", vehicles: "Vehicles & Fuel", reconciliations: "Reconciliations",
    reports: "Reports", settings: "Settings", audit: "Audit Log", totalCustody: "Total Custody",
    availableBalance: "Available Balance", pendingApprovals: "Pending Approvals", pendingTransfers: "Pending Transfers",
    addNewExpense: "Add New Expense", expenseDate: "Expense Date", amount: "Amount", category: "Category",
    description: "Description", submit: "Submit", cancel: "Cancel", status: "Status", search: "Search...",
    confirmReceipt: "Confirm Receipt", awaitingConfirmation: "Awaiting Confirmation", approved: "Approved",
    rejected: "Rejected", syncStatus: "Sync Status", synced: "Google Sheets Connected",
    offline: "Offline Mode (Preview)", save: "Save", logout: "Logout"
  }
};

/* ============================================================
   MOCK DATA (تُستخدم فقط في وضع الأوفلاين)
============================================================ */
const mockUsers = [
  { id: 1, name: 'System Admin', role: 'Admin', email: 'admin@hema.tech' },
  { id: 2, name: 'Finance Manager', role: 'Finance', email: 'finance@hema.tech' },
  { id: 3, name: 'Abdullah AlTowaijri', role: 'CustodyHolder', email: 'abdullah@hema.tech' },
  { id: 4, name: 'PASCAL OBWAVO', role: 'CustodyHolder', email: 'pascal@hema.tech' }
];
const mockCustodyAccounts = [
  { id: 'CUST-001', name: 'Abdullah AlTowaijri', balance: 5000, pending: 1200, transit: 0 },
  { id: 'CUST-002', name: 'PASCAL OBWAVO', balance: 1500, pending: 0, transit: 500 },
  { id: 'CUST-003', name: 'JHON JULIUS MONCATAR', balance: 350, pending: 0, transit: 0 }
];
const mockExpenses = [
  { id: 'EXP-101', date: '2026-06-20', holder: 'Abdullah AlTowaijri', category: 'وقود / ديزل', amount: 150, desc: 'وقود سيارة العمل', status: 'Pending Manager Approval', vehicle: 'ABC-123', odo: 125000 },
  { id: 'EXP-102', date: '2026-06-19', holder: 'PASCAL OBWAVO', category: 'مواد تكييف', amount: 450, desc: 'شراء غاز فريون', status: 'Approved' },
  { id: 'EXP-103', date: '2026-06-18', holder: 'Abdullah AlTowaijri', category: 'إصلاح مركبة', amount: 1200, desc: 'تغيير إطارات', status: 'Pending Finance Approval' }
];
const mockTransfers = [
  { id: 'TRN-201', date: '2026-06-21', sender: 'Finance', recipient: 'PASCAL OBWAVO', amount: 500, status: 'Awaiting Recipient Confirmation' },
  { id: 'TRN-202', date: '2026-06-15', sender: 'Finance', recipient: 'Abdullah AlTowaijri', amount: 5000, status: 'Received' }
];

/* ============================================================
   MAIN APP COMPONENT
============================================================ */
export default function App() {
  const [lang, setLang] = useState('ar');
  const t = (key) => dict[lang][key] || key;
  const isRTL = lang === 'ar';

  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [gasUrl, setGasUrl] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [expenses, setExpenses] = useState(mockExpenses);
  const [custody, setCustody] = useState(mockCustodyAccounts);
  const [transfers, setTransfers] = useState(mockTransfers);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // جلب كل البيانات من Google Sheets
  const loadData = async (url = gasUrl) => {
    if (!url) return false;
    try {
      setSyncing(true);
      const data = await apiGetAll(url);
      if (data && data.ok) {
        setExpenses((data.expenses || []).map(mapExpense));
        setCustody((data.custody || []).map(mapCustody));
        setTransfers((data.transfers || []).map(mapTransfer));
        setIsOnline(true);
        return true;
      }
      return false;
    } catch (e) {
      showToast("تعذّر الاتصال بقاعدة البيانات", "error");
      return false;
    } finally {
      setSyncing(false);
    }
  };

  // كائن الـ API يُمرَّر للواجهات
  const api = {
    online: isOnline,
    url: gasUrl,
    post: (action, payload) => apiPost(gasUrl, action, payload),
    reload: loadData,
    syncing
  };

  const handleLogin = async (email) => {
    // محاولة الدخول عبر Google Sheets أولاً إن كان متصلاً
    if (isOnline && gasUrl) {
      const res = await apiPost(gasUrl, 'login', { email });
      if (res && res.ok) {
        setUser(res.user);
        await loadData();
        showToast(isRTL ? "تم تسجيل الدخول بنجاح" : "Login successful");
        return;
      }
    }
    // وضع الأوفلاين: مطابقة محلية
    const found = mockUsers.find(u => u.email === email || u.role.toLowerCase() === email.toLowerCase());
    setUser(found || mockUsers[0]);
    showToast(isRTL ? "تم تسجيل الدخول (وضع تجريبي)" : "Login (demo mode)");
  };

  const handleLogout = () => { setUser(null); setView('dashboard'); };
  const navigateTo = (newView) => { setView(newView); setIsMobileMenuOpen(false); };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} t={t} lang={lang} setLang={setLang} isRTL={isRTL}
                        gasUrl={gasUrl} setGasUrl={setGasUrl} setIsOnline={setIsOnline} loadData={loadData} showToast={showToast} isOnline={isOnline} />;
  }

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard'), roles: ['Admin', 'Finance', 'CustodyHolder'] },
    { id: 'expenses', icon: FileText, label: t('expenses'), roles: ['Admin', 'Finance', 'CustodyHolder'] },
    { id: 'custody', icon: Wallet, label: t('custody'), roles: ['Admin', 'Finance'] },
    { id: 'transfers', icon: ArrowRightLeft, label: t('transfers'), roles: ['Admin', 'Finance', 'CustodyHolder'] },
    { id: 'approvals', icon: CheckCircle, label: t('approvals'), roles: ['Admin', 'Finance'] },
    { id: 'vehicles', icon: Car, label: t('vehicles'), roles: ['Admin', 'Finance'] },
    { id: 'reconciliations', icon: FileSpreadsheet, label: t('reconciliations'), roles: ['Admin', 'Finance', 'CustodyHolder'] },
    { id: 'reports', icon: FileOutput, label: t('reports'), roles: ['Admin', 'Finance'] },
    { id: 'settings', icon: Settings, label: t('settings'), roles: ['Admin'] },
    { id: 'audit', icon: History, label: t('audit'), roles: ['Admin'] },
  ];

  const Sidebar = () => (
    <>
      <div className="p-6 flex flex-col items-center border-b border-white/10">
        <img src={HEMAH_LOGO} alt="Hema Tech" className="h-12 object-contain mb-3" />
        <h1 className="text-sm font-bold text-center text-white/90">{t('appTitle')}</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.filter(m => m.roles.includes(user.role)).map(item => (
          <button key={item.id} onClick={() => navigateTo(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium
              ${view === item.id ? 'bg-[#00d084] text-[#0a2540] shadow-md' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}>
            <item.icon size={20} /><span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 text-center text-xs text-gray-400">
        <img src={MAWARID_LOGO} alt="Mawarid" className="h-6 mx-auto mb-2 opacity-80" />
        {t('poweredBy')}
      </div>
    </>
  );

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 flex text-gray-800 font-sans">
      <aside className="hidden md:flex flex-col w-64 bg-[#0a2540] text-white shadow-xl z-20"><Sidebar /></aside>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className={`relative flex flex-col w-64 bg-[#0a2540] text-white shadow-xl ${isRTL ? 'ms-auto' : ''}`}><Sidebar /></aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
            <h2 className="text-xl font-bold text-gray-800 hidden sm:block">{menuItems.find(m => m.id === view)?.label || t('dashboard')}</h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {isOnline && (
              <button onClick={() => loadData()} disabled={syncing} title="تحديث البيانات"
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
              </button>
            )}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isOnline ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {isOnline ? <Check size={14} /> : <AlertTriangle size={14} />}
              {isOnline ? t('synced') : t('offline')}
            </div>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
              <Globe size={16} />{lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <div className="flex items-center gap-3 border-s border-gray-200 px-2 sm:px-4">
              <div className="hidden sm:block text-end">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={t('logout')}><LogOut size={20} /></button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50 relative">
          {view === 'dashboard' && <DashboardView custody={custody} expenses={expenses} transfers={transfers} t={t} user={user} navigateTo={navigateTo} />}
          {view === 'expenses' && <ExpensesView expenses={expenses} setExpenses={setExpenses} t={t} user={user} showToast={showToast} api={api} />}
          {view === 'transfers' && <TransfersView transfers={transfers} setTransfers={setTransfers} custody={custody} setCustody={setCustody} t={t} user={user} showToast={showToast} api={api} />}
          {view === 'custody' && <CustodyView custody={custody} t={t} api={api} showToast={showToast} />}
          {view === 'approvals' && <ApprovalsView expenses={expenses} setExpenses={setExpenses} t={t} showToast={showToast} api={api} />}
          {view === 'settings' && <SettingsView gasUrl={gasUrl} setGasUrl={setGasUrl} setIsOnline={setIsOnline} t={t} showToast={showToast} loadData={loadData} isOnline={isOnline} />}

          {['vehicles', 'reconciliations', 'reports', 'audit'].includes(view) && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Activity size={48} className="mb-4 opacity-50" />
              <h2 className="text-xl font-medium mb-2">الوحدة قيد التطوير</h2>
              <p>{isOnline ? 'يتم جلب البيانات من Google Sheets' : 'فعّل الاتصال من الإعدادات'}</p>
            </div>
          )}
        </div>
      </main>

      {toast && (
        <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-medium
          ${toast.type === 'success' ? 'bg-[#00d084]' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   VIEWS & COMPONENTS
============================================================ */

function LoginScreen({ onLogin, t, lang, setLang, isRTL }) {
  const [email, setEmail] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); onLogin(email); };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-[#0a2540] to-[#12395d] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="absolute top-4 end-4">
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
          <Globe size={16} /> {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-8 shadow-2xl rounded-2xl border border-gray-100">
          <img src={HEMAH_LOGO} alt="Hema Tech" className="mx-auto h-20 w-auto object-contain mb-6" />
          <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-1">{t('appTitle')}</h2>
          <p className="text-center text-sm text-gray-500 mb-8">{t('appSubtitle')}</p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00d084] focus:border-[#00d084] sm:text-sm transition-colors"
                placeholder="admin@hema.tech / admin / finance" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
              <input type="password" className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00d084] focus:border-[#00d084] sm:text-sm transition-colors" placeholder="••••••••" />
            </div>
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-[#00d084] focus:ring-[#00d084] border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ms-2 block text-sm text-gray-900">{t('rememberMe')}</label>
            </div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#0a2540] bg-[#00d084] hover:bg-[#00e691] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00d084] transition-all transform hover:scale-[1.02]">
              {t('login')}
            </button>
          </form>
          <div className="mt-10 border-t pt-6 flex flex-col items-center">
            <img src={MAWARID_LOGO} alt="Mawarid" className="h-8 object-contain mb-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
            <p className="text-xs text-gray-400">{t('poweredBy')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ custody, expenses, transfers, t, user, navigateTo }) {
  const totalBalance = custody.reduce((sum, c) => sum + c.balance, 0);
  const totalPendingExp = expenses.filter(e => String(e.status).includes('Pending')).length;
  const awaitingTransfers = transfers.filter(tr => tr.status === 'Awaiting Recipient Confirmation').length;

  const kpis = [
    { title: t('totalCustody'), value: `SAR ${totalBalance.toLocaleString()}`, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-100', role: 'Admin' },
    { title: t('pendingApprovals'), value: totalPendingExp, icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-100', role: 'Admin' },
    { title: t('pendingTransfers'), value: awaitingTransfers, icon: ArrowRightLeft, color: 'text-purple-600', bg: 'bg-purple-100', role: 'Admin' },
    { title: t('availableBalance'), value: `SAR ${custody.find(c => c.name === user.name)?.balance || 0}`, icon: Wallet, color: 'text-green-600', bg: 'bg-green-100', role: 'CustodyHolder' },
    { title: 'نقد في الطريق (Transit)', value: `SAR ${custody.find(c => c.name === user.name)?.transit || 0}`, icon: ArrowRightLeft, color: 'text-orange-600', bg: 'bg-orange-100', role: 'CustodyHolder' }
  ];
  const visibleKpis = kpis.filter(k => k.role === user.role || (user.role === 'Finance' && k.role === 'Admin'));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleKpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${kpi.bg} ${kpi.color}`}><kpi.icon size={28} /></div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">إجراءات مطلوبة</h3>
          <div className="space-y-4">
            {transfers.filter(tr => tr.recipient === user.name && tr.status === 'Awaiting Recipient Confirmation').map(tr => (
              <div key={tr.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Bell size={20} /></div>
                  <div>
                    <p className="font-bold text-orange-900">تحويل وارد بانتظار التأكيد</p>
                    <p className="text-sm text-orange-700">مبلغ: SAR {tr.amount} | المرسل: {tr.sender}</p>
                  </div>
                </div>
                <button onClick={() => navigateTo('transfers')} className="px-4 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700">مراجعة</button>
              </div>
            ))}
            {(user.role === 'Admin' || user.role === 'Finance') && expenses.filter(e => String(e.status).includes('Pending')).slice(0, 3).map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={20} /></div>
                  <div>
                    <p className="font-bold text-gray-800">{exp.desc}</p>
                    <p className="text-sm text-gray-500">{exp.holder} | SAR {exp.amount}</p>
                  </div>
                </div>
                <button onClick={() => navigateTo('approvals')} className="px-4 py-2 bg-white border shadow-sm text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50">مراجعة</button>
              </div>
            ))}
            {expenses.filter(e => String(e.status).includes('Pending')).length === 0 && transfers.filter(tr => tr.recipient === user.name && tr.status === 'Awaiting Recipient Confirmation').length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <CheckCircle size={40} className="mx-auto mb-3 opacity-50" />
                <p>لا توجد إجراءات معلقة حالياً</p>
              </div>
            )}
          </div>
        </div>

        {(user.role === 'Admin' || user.role === 'Finance') && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />عهد ذات رصيد منخفض
            </h3>
            <div className="space-y-4">
              {custody.filter(c => c.balance < 1000).map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 border rounded-xl bg-red-50/30 border-red-100">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{c.name}</p>
                    <p className="text-xs text-red-600 font-medium">SAR {c.balance} متاح</p>
                  </div>
                  <button onClick={() => navigateTo('custody')} className="text-xs font-bold bg-white border shadow-sm px-3 py-1.5 rounded-lg hover:bg-gray-50">شحن</button>
                </div>
              ))}
              {custody.filter(c => c.balance < 1000).length === 0 && <p className="text-sm text-gray-400">لا توجد تنبيهات.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExpensesView({ expenses, setExpenses, t, user, showToast, api }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const myExpenses = user.role === 'CustodyHolder' ? expenses.filter(e => e.holder === user.name) : expenses;

  const handleSave = async (newExp) => {
    setExpenses([newExp, ...expenses]); // تحديث متفائل
    setShowAddForm(false);
    if (api.online) {
      const res = await api.post('addExpense', newExp);
      if (res && res.ok) { await api.reload(); showToast("تم حفظ المصروف في Google Sheets"); }
      else showToast("تعذّر الحفظ في القاعدة", "error");
    } else {
      showToast("تم إرسال المصروف للموافقة (وضع تجريبي)");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">{t('expenses')}</h2>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#00d084] text-[#0a2540] font-bold rounded-xl shadow-sm hover:shadow-md transition-all">
          <Plus size={20} />{t('addNewExpense')}
        </button>
      </div>

      {showAddForm ? (
        <AddExpenseForm onClose={() => setShowAddForm(false)} onSave={handleSave} user={user} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-start">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">المعرف</th><th className="px-6 py-4">{t('expenseDate')}</th>
                  <th className="px-6 py-4">العهدة</th><th className="px-6 py-4">{t('category')}</th>
                  <th className="px-6 py-4">{t('amount')}</th><th className="px-6 py-4">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500">{exp.id}</td>
                    <td className="px-6 py-4">{exp.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{exp.holder}</td>
                    <td className="px-6 py-4"><span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs">{exp.category}</span></td>
                    <td className="px-6 py-4 font-bold">SAR {Number(exp.amount).toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={exp.status} /></td>
                  </tr>
                ))}
                {myExpenses.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">لا توجد مصروفات.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AddExpenseForm({ onClose, onSave, user }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], amount: '', category: 'مستلزمات مكتبية',
    desc: '', vehicle: '', odo: '', file: null
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const categories = ['وقود / ديزل', 'مواد تكييف', 'مواد كهرباء', 'إصلاح مركبة', 'مستلزمات مكتبية', 'مصروف آخر'];

  const handleFileUpload = (e) => {
    setIsExtracting(true);
    const file = e.target.files[0];
    setTimeout(() => {
      setFormData(prev => ({ ...prev, amount: '245', desc: 'مشتريات فاتورة مسحوبة آلياً', file }));
      setIsExtracting(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: `EXP-${Math.floor(Math.random() * 10000)}`, date: formData.date, holder: user.name,
      category: formData.category, amount: parseFloat(formData.amount), desc: formData.desc,
      status: 'Pending Finance Approval', vehicle: formData.vehicle, odo: formData.odo
    });
  };

  const isVehicleCategory = formData.category.includes('وقود') || formData.category.includes('مركبة');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-3xl">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h3 className="text-xl font-bold text-gray-800">تسجيل مصروف جديد</h3>
        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors relative">
          <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,.pdf" />
          {isExtracting ? (
            <div className="flex flex-col items-center text-[#00d084]"><Activity className="animate-spin mb-3" size={32} /><p className="font-bold">جاري استخراج البيانات بالذكاء الاصطناعي...</p></div>
          ) : formData.file ? (
            <div className="flex flex-col items-center text-green-600"><CheckCircle size={32} className="mb-3" /><p className="font-bold">تم إرفاق الفاتورة: {formData.file.name}</p></div>
          ) : (
            <div className="flex flex-col items-center text-gray-500"><Upload size={32} className="mb-3 opacity-50" /><p className="font-bold text-gray-700">اسحب الفاتورة هنا أو انقر للرفع</p><p className="text-sm mt-1">يدعم PDF, JPG, PNG (سيتم استخراج البيانات آلياً)</p></div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الصرف *</label>
            <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00d084] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">المبلغ (SAR) *</label>
            <input type="number" required min="1" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00d084] focus:outline-none" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف *</label>
            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00d084] focus:outline-none">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">وصف العملية *</label>
            <input type="text" required value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00d084] focus:outline-none" placeholder="شرح مبسط للمصروف" />
          </div>
          {isVehicleCategory && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم المركبة *</label>
                <input type="text" required value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00d084] focus:outline-none" placeholder="مثال: ABC-123" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">قراءة العداد بالكيلومتر *</label>
                <input type="number" required value={formData.odo} onChange={e => setFormData({ ...formData, odo: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00d084] focus:outline-none" placeholder="125000" />
              </div>
            </>
          )}
        </div>
        <div className="flex gap-4 pt-6 border-t mt-8">
          <button type="submit" className="flex-1 bg-[#0a2540] text-white font-bold py-3 rounded-xl hover:bg-[#12395d] transition-colors shadow-md">حفظ وإرسال للموافقة</button>
          <button type="button" onClick={onClose} className="px-8 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">إلغاء</button>
        </div>
      </form>
    </div>
  );
}

function ApprovalsView({ expenses, setExpenses, t, showToast, api }) {
  const pending = expenses.filter(e => String(e.status).includes('Pending'));

  const handleAction = async (id, action) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: action === 'approve' ? 'Approved' : 'Rejected' } : e));
    if (api.online) {
      const res = await api.post(action === 'approve' ? 'approveExpense' : 'rejectExpense', { id });
      if (res && res.ok) { await api.reload(); }
    }
    showToast(action === 'approve' ? 'تم الموافقة على المصروف بنجاح' : 'تم رفض المصروف');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t('approvals')}</h2>
      {pending.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
          <CheckCircle size={48} className="mx-auto mb-4 opacity-50" /><h3 className="text-xl font-medium">لا توجد طلبات معلقة</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pending.map(exp => (
            <div key={exp.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border">{exp.id}</span>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">{exp.status}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">SAR {Number(exp.amount).toLocaleString()}</h3>
                <p className="text-sm font-medium text-gray-600">{exp.holder}</p>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">التصنيف:</span> <span className="font-medium">{exp.category}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">التاريخ:</span> <span className="font-medium">{exp.date}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500">الوصف:</span> <span className="font-medium text-end max-w-[60%]">{exp.desc}</span></div>
                {exp.vehicle && <div className="flex justify-between border-b pb-2"><span className="text-gray-500">المركبة:</span> <span className="font-medium">{exp.vehicle} ({exp.odo} كم)</span></div>}
              </div>
              <div className="p-4 bg-gray-50 flex gap-3">
                <button onClick={() => handleAction(exp.id, 'approve')} className="flex-1 bg-[#00d084] text-[#0a2540] font-bold py-2.5 rounded-xl hover:bg-[#00e691] transition-colors shadow-sm">موافقة</button>
                <button onClick={() => handleAction(exp.id, 'reject')} className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-colors">رفض</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TransfersView({ transfers, setTransfers, custody, setCustody, t, user, showToast, api }) {
  const handleConfirm = async (id, amount, recipient) => {
    setTransfers(prev => prev.map(tr => tr.id === id ? { ...tr, status: 'Received' } : tr));
    setCustody(prev => prev.map(c => c.name === recipient ? { ...c, balance: c.balance + amount, transit: Math.max(0, c.transit - amount) } : c));
    if (api.online) {
      const res = await api.post('confirmTransfer', { id });
      if (res && res.ok) { await api.reload(); }
    }
    showToast("تم تأكيد الاستلام بنجاح، وتم تحديث الرصيد.");
  };

  const visibleTransfers = user.role === 'CustodyHolder'
    ? transfers.filter(tr => tr.recipient === user.name || tr.sender === user.name)
    : transfers;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('transfers')}</h2>
        {(user.role === 'Admin' || user.role === 'Finance') && (
          <NewTransferButton custody={custody} api={api} showToast={showToast} setTransfers={setTransfers} setCustody={setCustody} transfers={transfers} />
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">المعرف</th><th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4">المرسل</th><th className="px-6 py-4">المستلم</th>
                <th className="px-6 py-4">المبلغ</th><th className="px-6 py-4">الحالة</th><th className="px-6 py-4">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleTransfers.map((tr) => (
                <tr key={tr.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono text-gray-500">{tr.id}</td>
                  <td className="px-6 py-4">{tr.date}</td>
                  <td className="px-6 py-4 font-medium">{tr.sender}</td>
                  <td className="px-6 py-4 font-medium">{tr.recipient}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">SAR {tr.amount}</td>
                  <td className="px-6 py-4"><StatusBadge status={tr.status} /></td>
                  <td className="px-6 py-4">
                    {tr.status === 'Awaiting Recipient Confirmation' && user.name === tr.recipient && (
                      <button onClick={() => handleConfirm(tr.id, tr.amount, tr.recipient)} className="bg-[#00d084] text-[#0a2540] px-4 py-1.5 rounded-lg text-xs font-bold hover:shadow-md transition-all">{t('confirmReceipt')}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NewTransferButton({ custody, api, showToast, setTransfers, setCustody, transfers }) {
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState(custody[0]?.name || '');
  const [amount, setAmount] = useState('');

  const submit = async () => {
    const amt = parseFloat(amount);
    if (!recipient || !amt || amt <= 0) { showToast("أدخل مستلماً ومبلغاً صحيحاً", "error"); return; }
    const newTr = { id: `TRN-${Math.floor(Math.random() * 10000)}`, date: new Date().toISOString().split('T')[0], sender: 'Finance', recipient, amount: amt, status: 'Awaiting Recipient Confirmation' };
    setTransfers([newTr, ...transfers]);
    setCustody(prev => prev.map(c => c.name === recipient ? { ...c, transit: c.transit + amt } : c));
    setOpen(false); setAmount('');
    if (api.online) {
      const res = await api.post('addTransfer', { recipient, amount: amt, sender: 'Finance' });
      if (res && res.ok) { await api.reload(); }
    }
    showToast("تم إنشاء التحويل بانتظار تأكيد المستلم");
  };

  if (!open) return <button onClick={() => setOpen(true)} className="px-5 py-2.5 bg-[#0a2540] text-white font-bold rounded-xl shadow-sm hover:bg-[#12395d]">+ تحويل جديد</button>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-5">
        <div className="flex justify-between items-center"><h3 className="text-lg font-bold">تحويل جديد</h3><button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20} /></button></div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">المستلم</label>
          <select value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00d084] focus:outline-none">
            {custody.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">المبلغ (SAR)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00d084] focus:outline-none" placeholder="0.00" />
        </div>
        <button onClick={submit} className="w-full bg-[#0a2540] text-white font-bold py-3 rounded-xl hover:bg-[#12395d]">إرسال التحويل</button>
      </div>
    </div>
  );
}

function CustodyView({ custody, t, api, showToast }) {
  const recharge = async (name) => {
    const val = window.prompt(`أدخل مبلغ الشحن للعهدة: ${name}`);
    const amt = parseFloat(val);
    if (!amt || amt <= 0) return;
    if (api.online) {
      const res = await api.post('rechargeCustody', { name, amount: amt });
      if (res && res.ok) { await api.reload(); showToast(`تم شحن ${name} بمبلغ SAR ${amt}`); return; }
    }
    showToast("الشحن متاح فقط في وضع الاتصال", "error");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('custody')}</h2>
        <button className="px-5 py-2.5 bg-white border shadow-sm font-bold rounded-xl text-gray-700 hover:bg-gray-50">تصدير الكشف (Excel)</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {custody.map(c => (
          <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            <div className={`absolute top-0 inset-x-0 h-1 ${c.balance < 1000 ? 'bg-red-500' : 'bg-[#00d084]'}`}></div>
            <div className="flex justify-between items-start mb-6 pt-2">
              <div><h3 className="text-lg font-bold text-gray-900 mb-1">{c.name}</h3><p className="text-xs font-mono text-gray-400">{c.id}</p></div>
              <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Wallet size={24} /></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b pb-4">
                <span className="text-gray-500 text-sm">الرصيد المتاح</span>
                <span className={`text-2xl font-black ${c.balance < 1000 ? 'text-red-600' : 'text-gray-900'}`}>SAR {c.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">نقد في الطريق (معلق)</span><span className="font-bold text-orange-600">SAR {c.transit.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">مصروفات غير معتمدة</span><span className="font-bold text-blue-600">SAR {c.pending.toLocaleString()}</span></div>
            </div>
            <div className="mt-6 pt-4 border-t flex gap-2">
              <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold py-2 rounded-lg transition-colors border">كشف حساب</button>
              <button onClick={() => recharge(c.name)} className="flex-1 bg-[#0a2540] hover:bg-[#12395d] text-white text-sm font-bold py-2 rounded-lg transition-colors">تغذية / شحن</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ gasUrl, setGasUrl, setIsOnline, t, showToast, loadData, isOnline }) {
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    if (!gasUrl || gasUrl.length < 10) { showToast("أدخل رابطاً صحيحاً", "error"); return; }
    setLoading(true);
    try {
      const ping = await apiPing(gasUrl);
      if (ping && ping.ok) {
        const ok = await loadData(gasUrl);
        if (ok) { setIsOnline(true); showToast("تم الاتصال بـ Google Sheets بنجاح ✓"); }
        else showToast("الاتصال نجح لكن تعذّر جلب البيانات", "error");
      } else {
        setIsOnline(false); showToast("لم يستجب الخادم. تأكد من النشر بصلاحية Anyone.", "error");
      }
    } catch (e) {
      setIsOnline(false); showToast("فشل الاتصال. تحقق من الرابط وصلاحيات النشر.", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Globe className="text-[#00d084]" size={28} />ربط قاعدة البيانات السحابية
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          نظام Hema Tech يعتمد على <b>Google Sheets</b> و <b>Google Apps Script</b> كقاعدة بيانات حية للعمليات المالية. أدخل رابط الـ Web App بعد نشره.
        </p>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Google Apps Script API URL *</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input type="url" value={gasUrl} onChange={e => setGasUrl(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00d084] focus:outline-none bg-gray-50 font-mono text-sm"
              placeholder="https://script.google.com/macros/s/.../exec" />
            <button onClick={testConnection} disabled={loading}
              className="px-6 py-3 bg-[#0a2540] text-white font-bold rounded-xl hover:bg-[#12395d] transition-colors whitespace-nowrap min-w-[140px]">
              {loading ? <Activity className="animate-spin mx-auto" /> : 'اختبار الاتصال'}
            </button>
          </div>
          {isOnline && <p className="mt-3 text-sm text-green-600 font-bold flex items-center gap-2"><Check size={16} /> متصل بقاعدة البيانات</p>}
        </div>
        <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
          <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Settings size={18} /> بيانات الإعداد الافتراضي</h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Spreadsheet ID: <code className="bg-white px-2 py-0.5 rounded text-xs">1uREspJqXrHmA4beZQYFNBQK2DxHIpUXUHr-fLKAGHUI</code></li>
            <li>شغّل الدالة <code className="bg-white px-1 rounded">setup()</code> مرة واحدة لإنشاء الجداول.</li>
            <li>انشر <code className="bg-white px-1 rounded">Code.gs</code> كـ Web App بصلاحية Anyone، ثم الصق رابط <code className="bg-white px-1 rounded">/exec</code> هنا.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let color = 'bg-gray-100 text-gray-700 border-gray-200';
  let label = status;
  const s = String(status || '');
  if (s.includes('Approved') || s === 'Received') {
    color = 'bg-green-50 text-green-700 border-green-200';
    label = s === 'Received' ? 'مستلم' : 'معتمد';
  } else if (s.includes('Pending') || s.includes('Awaiting')) {
    color = 'bg-orange-50 text-orange-700 border-orange-200';
    label = s.includes('Awaiting') ? 'بانتظار التأكيد' : 'بانتظار الموافقة';
  } else if (s.includes('Rejected')) {
    color = 'bg-red-50 text-red-700 border-red-200';
    label = 'مرفوض';
  }
  return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${color}`}>{label}</span>;
}
