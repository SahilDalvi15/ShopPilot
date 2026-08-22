const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'User',
    unique: true,
    index: true
  },
  storeName: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    unique: true,
    index: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Store description is required'],
    trim: true
  },
  logo: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'active',
    index: true
  },
  totalSales: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
vendorSchema.index({ createdAt: -1 });

// Generate slug from storeName before saving
vendorSchema.pre('validate', function(next) {
  if (this.isModified('storeName') && !this.slug) {
    const slugify = require('slugify');
    this.slug = slugify(this.storeName, { lower: true });
  }
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
