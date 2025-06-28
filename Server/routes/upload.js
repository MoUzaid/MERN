const router = require('express').Router();
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

dotenv.config();
router.use(cors());

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Cloudinary Storage Setup with Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Validate file type
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedFormats.includes(file.mimetype)) {
      throw new Error('Only JPG and PNG files are allowed');
    }

    return {
      folder: 'uploads',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
}).single('image');

// Upload Route
router.post('/upload', auth, authAdmin, (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      // Multer or validation error
      return res.status(400).json({ msg: err.message || 'Upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    res.json({
      msg: 'Image uploaded successfully',
      url: req.file.path,
      public_id: req.file.filename,
    });
  });
});

// Delete Route
router.delete('/delete/:public_id', auth, authAdmin, async (req, res) => {
  try {
    const { public_id } = req.params;

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      res.json({ msg: 'Image deleted successfully' });
    } else {
      res.status(400).json({ msg: 'Failed to delete image', result });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Delete failed', error });
  }
});

module.exports = router;
