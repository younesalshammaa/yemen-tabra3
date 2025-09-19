const Donation = require('../models/Donation');
const path = require('path');

// جلب جميع الحالات
exports.getAll = async (req, res) => {
  try {
    const donations = await Donation.findAll();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// جلب حالة حسب المعرف
exports.getById = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id);
    if (!donation) return res.status(404).json({ message: 'الحالة غير موجودة' });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// إضافة حالة جديدة
exports.create = async (req, res) => {
  try {
    // التحقق من وجود الصورة
    if (!req.file) {
      return res.status(400).json({ message: 'يرجى رفع صورة' });
    }

    // إنشاء مسار الصورة
    const imageUrl = `/uploads/${req.file.filename}`;

    // جمع البيانات
    const {
      title,
      category,
      location,
      beneficiaries,
      targetAmount,
      description,
      endDate
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!title || !category || !location || !beneficiaries || !targetAmount || !description || !endDate) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    // إنشاء الحالة
    const donation = await Donation.create({
      title,
      category,
      location,
      beneficiaries: parseInt(beneficiaries),
      targetAmount: parseFloat(targetAmount),
      description,
      endDate,
      imageUrl,
      raisedAmount: 0,
      status: 'active'
    });

    res.status(201).json(donation);
  } catch (error) {
    console.error('❌ خطأ في الإنشاء:', error);
    res.status(500).json({ message: 'فشل الإضافة' });
  }
};

// تحديث حالة
exports.update = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id);
    if (!donation) return res.status(404).json({ message: 'غير موجودة' });

    // جمع البيانات
    const {
      title,
      category,
      location,
      beneficiaries,
      targetAmount,
      description,
      endDate,
      status
    } = req.body;

    // تحديث البيانات
    const updateData = {
      title,
      category,
      location,
      beneficiaries: beneficiaries ? parseInt(beneficiaries) : undefined,
      targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
      description,
      endDate,
      status: status || donation.status
    };

    // إذا تم رفع صورة جديدة، استخدمها
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await donation.update(updateData);
    res.json(donation);
  } catch (error) {
    console.error('❌ خطأ في التحديث:', error);
    res.status(500).json({ message: 'فشل التحديث' });
  }
};

// حذف حالة
exports.delete = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id);
    if (!donation) return res.status(404).json({ message: 'غير موجودة' });

    // حذف الصورة من المجلد (اختياري)
    const fs = require('fs');
    const imagePath = path.join(__dirname, '../../frontend-website', donation.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await donation.destroy();
    res.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('❌ خطأ في الحذف:', error);
    res.status(500).json({ message: 'فشل الحذف' });
  }
};