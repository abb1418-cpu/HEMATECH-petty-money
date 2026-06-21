# نظام إدارة العهد المالية — Hema Tech Petty Cash

نظام لإدارة العهد المالية والمصروفات النثرية، مبني بـ **React + Vite + Tailwind CSS**، ويتصل بقاعدة بيانات **Google Sheets** عبر Google Apps Script.

> Powered by Mawarid

## التشغيل محلياً

```bash
npm install
npm run dev
```

ثم افتح الرابط الظاهر (عادة http://localhost:5173).

## البناء للإنتاج

```bash
npm run build      # يُنتج مجلد dist/
npm run preview    # معاينة نسخة الإنتاج محلياً
```

## النشر على GitHub Pages

يحتوي المشروع على workflow جاهز في `.github/workflows/deploy.yml` يبني الموقع وينشره تلقائياً عند كل رفع إلى فرع `main`.

الخطوات:
1. ارفع المشروع إلى مستودع GitHub.
2. من المستودع: **Settings ← Pages ← Source = GitHub Actions**.
3. أي `git push` إلى `main` سينشر الموقع تلقائياً على:
   `https://<اسم-حسابك>.github.io/<اسم-المستودع>/`

التفاصيل الكاملة في ملف **دليل النشر على GitHub**.

## ربط قاعدة البيانات

1. أنشئ ملف Google Sheets وافتح Apps Script (Extensions ← Apps Script).
2. الصق محتوى `Code.gs` وشغّل دالة `setup` مرة واحدة.
3. انشره كـ Web App (Execute as: Me / Who has access: Anyone) وانسخ رابط `/exec`.
4. داخل التطبيق: الإعدادات ← الصق الرابط ← اختبار الاتصال.

التفاصيل في ملف **دليل ربط قوقل شيت**.

## بنية المشروع

```
hema-app/
├── .github/workflows/deploy.yml   # نشر تلقائي على GitHub Pages
├── src/
│   ├── App.jsx                     # التطبيق الكامل
│   ├── main.jsx                    # نقطة الدخول
│   └── index.css                   # Tailwind
├── index.html
├── vite.config.js                  # base: './' للعمل على Pages
├── tailwind.config.js
├── postcss.config.js
└── package.json
```
