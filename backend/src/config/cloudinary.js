const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const logger = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shoppilot/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' }, // Limit image size
      { quality: 'auto' }, // Optimize quality
    ],
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

// Configure multer with Cloudinary storage
const multer = require('multer');
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Image deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    logger.error(`Failed to delete image from Cloudinary: ${error.message}`);
  }
};

// Helper function to delete multiple images
const deleteImages = async (publicIds) => {
  try {
    await cloudinary.api.delete_resources(publicIds);
    logger.info(`Multiple images deleted from Cloudinary: ${publicIds.length} images`);
  } catch (error) {
    logger.error(`Failed to delete multiple images from Cloudinary: ${error.message}`);
  }
};

module.exports = {
  cloudinary,
  storage,
  upload,
  deleteImage,
  deleteImages,
};
