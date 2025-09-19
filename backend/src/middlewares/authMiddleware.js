const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // نحتاج التأكد من وجود النموذج
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'الرجاء تسجيل الدخول' });
  }

  try {
    // التحقق من صلاحية التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // التأكد من أن المسؤول لا يزال موجودًا في قاعدة البيانات
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res.status(403).json({ message: 'المستخدم غير موجود' });
    }

    // حفظ معلومات المسؤول في الطلب
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'رمز غير صالح' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'انتهت صلاحية الرمز' });
    }
    return res.status(500).json({ message: 'خطأ في التحقق' });
  }
};

module.exports = authMiddleware;