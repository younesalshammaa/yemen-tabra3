const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ✅ استبدال الدالة الأصلية بإنشاء توكن
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'الرجاء إدخال اسم المستخدم وكلمة المرور' });
    }

    const Admin = require('../models/Admin');
    const bcrypt = require('bcryptjs');

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });

    // ✅ إنشاء JWT
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token, message: 'تم تسجيل الدخول بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;