const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Product ID is required'],
    ref: 'Product'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    unique: true,
    ref: 'User',
    index: true
  },
  items: [wishlistItemSchema]
}, {
  timestamps: true
});

// Indexes
wishlistSchema.index({ userId: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
