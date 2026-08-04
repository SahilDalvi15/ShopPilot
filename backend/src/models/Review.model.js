const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Product ID is required'],
    ref: 'Product',
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'User',
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: String,
  comment: {
    type: String,
    required: [true, 'Comment is required']
  },
  images: [String],
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
    index: true
  },
  isApproved: {
    type: Boolean,
    default: true,
    index: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  notHelpfulCount: {
    type: Number,
    default: 0
  },
  isAdminResponse: {
    type: Boolean,
    default: false
  },
  adminResponse: String,
  adminResponseAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// IndexesreviewSchema.index({ orderId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ productId: 1, rating: 1 });
reviewSchema.index({ productId: 1, isVerifiedPurchase: 1 });

// Ensure one review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
