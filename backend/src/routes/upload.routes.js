const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');

// Upload multiple images (max 5)
router.post('/images', authenticate, authorize(['admin', 'super_admin']), (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    handleUploadError(err, req, res, next);
  });
}, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded',
    });
  }

  const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

  res.status(200).json({
    success: true,
    message: 'Images uploaded successfully',
    data: {
      images: imageUrls,
      count: imageUrls.length,
    },
  });
});

// Upload single image
router.post('/image', authenticate, authorize(['admin', 'super_admin']), (req, res, next) => {
  const { uploadSingle } = require('../middleware/upload');
  uploadSingle(req, res, (err) => {
    handleUploadError(err, req, res, next);
  });
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      image: `/uploads/${req.file.filename}`,
    },
  });
});

module.exports = router;
