const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    default: 'ShopPilot'
  },
  contactEmail: {
    type: String,
    required: true,
    default: 'support@shoppilot.com'
  },
  logoUrl: {
    type: String,
    default: ''
  },
  currency: {
    type: String,
    default: 'INR'
  },
  taxRate: {
    type: Number,
    default: 18 // Default 18% GST for India
  },
  shippingCharge: {
    type: Number,
    default: 50
  },
  freeShippingThreshold: {
    type: Number,
    default: 500
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
