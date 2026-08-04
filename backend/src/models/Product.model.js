const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
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
    required: [true, 'Product description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Brand is required'],
    ref: 'Brand',
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Category is required'],
    ref: 'Category',
    index: true
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  discountedPrice: {
    type: Number
  },
  currency: {
    type: String,
    default: 'INR'
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  tags: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// IndexesproductSchema.index({ title: 'text' });productSchema.index({ price: 1 });
productSchema.index({ discountedPrice: 1 });
productSchema.index({ rating: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ categoryId: 1, isActive: 1 });
productSchema.index({ brandId: 1, isActive: 1 });

// Calculate discounted price before saving
productSchema.pre('save', function(next) {
  if (this.discount > 0) {
    this.discountedPrice = this.price - (this.price * this.discount / 100);
  } else {
    this.discountedPrice = this.price;
  }
  
  // Generate slug from title if not provided
  if (this.isModified('title') && !this.slug) {
    const slugify = require('slugify');
    this.slug = slugify(this.title, { lower: true });
  }
  
  next();
});

// Virtual for in stock
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

module.exports = mongoose.model('Product', productSchema);
