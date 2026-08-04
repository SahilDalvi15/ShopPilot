const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'User',
    index: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required'],
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    default: 'India',
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true
  },
  addressType: {
    type: String,
    enum: ['home', 'office', 'other'],
    default: 'home'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// IndexesaddressSchema.index({ userId: 1, isDefault: 1 });
addressSchema.index({ isDeleted: 1 });

// Pre-save middleware to ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault && this.isNew) {
    await this.constructor.updateMany(
      { userId: this.userId, isDefault: true },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('Address', addressSchema);
