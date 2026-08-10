const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Product ID is required'],
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  selectedSize: String,
  discountedPrice: Number,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    unique: true,
    ref: 'User',
    index: true
  },
  items: [cartItemSchema],
  appliedCoupon: {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon'
    },
    code: String,
    discountAmount: Number
  },
  subtotal: {
    type: Number,
    default: 0
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.totalDiscount = this.items.reduce((sum, item) => {
    const itemDiscount = item.discountedPrice ? (item.price - item.discountedPrice) * item.quantity : 0;
    return sum + itemDiscount;
  }, 0) + (this.appliedCoupon?.discountAmount || 0);
  this.totalAmount = this.subtotal - this.totalDiscount;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
