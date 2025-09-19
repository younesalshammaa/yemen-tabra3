const express = require('express');
const router = express.Router();

const { getAll, getById, create, update, delete: deleteDonation } = require('../controllers/donationController');
const authMiddleware = require('../middlewares/authMiddleware'); // ✅ تصحيح الاسم

const multer = require('multer');
const path = require('path');

// ✅ التأكد من المسار الصحيح: من داخل backend/src/routes
const uploadDir = path.join(__dirname, '../../frontend-website/uploads');

// تأكد من أن المجلد موجود
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `donation_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('يُسمح فقط بالصور'));
    }
  }
});

// --- المسارات ---
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authMiddleware, upload.single('imageUrl'), create);
router.put('/:id', authMiddleware, upload.single('imageUrl'), update);
router.delete('/:id', authMiddleware, deleteDonation); // ✅ حماية الحذف

module.exports = router;