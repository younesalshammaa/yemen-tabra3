const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// تسجيل الدخول
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: 'بيانات خاطئة' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'بيانات خاطئة' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      admin: { username: admin.username }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};