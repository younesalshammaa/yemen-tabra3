const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- تحديد المسارات ---
const frontendDir = path.join(__dirname, '..', 'frontend-website');
const adminDashboardDir = path.join(__dirname, '..', 'admin-dashboard');
const uploadDir = path.join(frontendDir, 'uploads');

// --- إنشاء مجلد uploads إذا لم يكن موجودًا ---
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- جعل المجلدات قابلة للوصول العام ---
// 1. خدمة الواجهة الرئيسية
app.use('/', express.static(frontendDir));           // يُخدم index.html + css + js + uploads

// 2. خدمة لوحة التحكم
app.use('/admin', express.static(adminDashboardDir)); // يُخدم admin-dashboard

// 3. خدمة الصور (مهمة)
app.use('/uploads', express.static(uploadDir));

// ✅ 4. تأكد من أن الملفات الداخلية مثل /js/main.js تُخدم تلقائيًا
// (موجودة أصلاً بسبب السطر الأول، لكن نضيف تأكيدًا)
app.get('/js/:file', (req, res) => {
  const filePath = path.join(frontendDir, 'js', req.params.file);
  res.sendFile(filePath, (err) => {
    if (err) console.error(`❌ ملف JS غير موجود: ${filePath}`);
  });
});

app.get('/css/:file', (req, res) => {
  const filePath = path.join(frontendDir, 'css', req.params.file);
  res.sendFile(filePath, (err) => {
    if (err) console.error(`❌ ملف CSS غير موجود: ${filePath}`);
  });
});

// --- استيراد authMiddleware (إذا كنت ستحتاجه لاحقًا) ---
// const authMiddleware = require('./src/middlewares/authMiddleware');

// --- إنشاء حساب المسؤول تلقائيًا ---
const createAdminAccount = async () => {
  try {
    const Admin = require('./src/models/Admin');
    const bcrypt = require('bcryptjs');

    const existing = await Admin.findOne({ where: { username: 'admin' } });
    if (existing) {
      if (!existing.password.startsWith('$2b$')) {
        console.log('🔑 الحساب موجود لكن كلمة المرور غير مشفرة. جاري التحديث...');
        const hashed = await bcrypt.hash('yemen123', 10);
        existing.password = hashed;
        await existing.save();
        console.log('✅ تم تحديث كلمة المرور وتشفيرها');
      } else {
        console.log('🟢 الحساب موجود مسبقًا: admin');
      }
      return;
    }

    const hashedPassword = await bcrypt.hash('yemen123', 10);
    await Admin.create({
      username: 'admin',
      password: hashedPassword
    });

    console.log('🔐 تم إنشاء حساب المسؤول بنجاح: admin / yemen123');
    console.log('   ⚠️  تم تشفير كلمة المرور فورًا');
  } catch (error) {
    console.error('❌ خطأ في إنشاء الحساب:', error.message);
  }
};

// --- المسارات ---
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/donations', require('./src/routes/donationRoutes'));

// ✅ روت الإحصائيات
app.get('/api/stats', async (req, res) => {
  try {
    const Donation = require('./src/models/Donation');

    const availableOpportunities = await Donation.count({
      where: { status: 'active' }
    });
    const completedOpportunities = await Donation.count({
      where: { status: 'completed' }
    });
    const totalBeneficiaries = (await Donation.sum('beneficiaries')) || 0;

    res.json({
      availableOpportunities,
      completedOpportunities,
      totalBeneficiaries
    });
  } catch (error) {
    console.error('❌ خطأ في جلب الإحصائيات:', error);
    res.status(500).json({
      error: 'تعذر جلب الإحصائيات',
      details: error.message
    });
  }
});

// --- اختبار الخادم ---
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// --- تشغيل الخادم ---
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ الاتصال بقاعدة البيانات ناجح');

    await sequelize.sync({ alter: true });
    console.log('🔄 الجداول تم مزامنتها');

    await createAdminAccount();

    app.listen(PORT, () => {
      console.log(`\n🚀 الخادم يعمل على http://localhost:${PORT}`);
      console.log(`📁 الصفحة الرئيسية: http://localhost:${PORT}`);
      console.log(`📁 لوحة التحكم: http://localhost:${PORT}/admin/login.html`);
      console.log(`📊 الإحصائيات: http://localhost:${PORT}/api/stats`);
      console.log(`📁 الصور: http://localhost:${PORT}/uploads`);
      console.log(`📁 ملف JS: http://localhost:${PORT}/js/main.js`);
      console.log(`📁 ملف CSS: http://localhost:${PORT}/css/style.css`);
      console.log(`\n`);
    });
  } catch (error) {
    console.error('❌ خطأ في التشغيل:', error);
  }
};

startServer();