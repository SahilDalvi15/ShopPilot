const multer = require('multer');
const { cloudinary, storage, deleteImage, deleteImages } = require('../config/cloudinary');

// Configure upload with Cloudinary storage
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Single image upload
const uploadSingle = upload.single('image');

// Multiple images upload (max 5)
const uploadMultiple = upload.array('images', 5);

// Error handling middleware for upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 5MB limit',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 images allowed',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field',
      });
    }
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  cloudinary,
  deleteImage,
  deleteImages,
};
