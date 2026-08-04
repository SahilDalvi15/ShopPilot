const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    unique: true,
    trim: true
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
    trim: true
  },
  logo: String,
  website: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// IndexesbrandSchema.index({ isActive: 1 });

// Generate slug from name before saving
brandSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    const slugify = require('slugify');
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
