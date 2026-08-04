const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  maxDiscountAmount: Number,
  minOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  usageLimit: Number,
  usageLimitPerUser: {
    type: Number,
    default: 1
  },
  usedCount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required']
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required']
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  applicableBrands: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// IndexescouponSchema.index({ validFrom: 1 });
couponSchema.index({ validUntil: 1 });

// Virtual for checking if coupon is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         !this.isDeleted && 
         now >= this.validFrom && 
         now <= this.validUntil &&
         (!this.usageLimit || this.usedCount < this.usageLimit);
});

// Virtual for checking if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return new Date() > this.validUntil;
});

// Virtual for checking if coupon usage limit reached
couponSchema.virtual('isUsageLimitReached').get(function() {
  return this.usageLimit && this.usedCount >= this.usageLimit;
});

module.exports = mongoose.model('Coupon', couponSchema);
