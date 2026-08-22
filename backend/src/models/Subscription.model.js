const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  country: String,
  postalCode: String
});

const subscriptionItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productTitle: String,
  productImage: String,
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  selectedSize: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [subscriptionItemSchema],
  frequency: {
    type: Number,
    required: true,
    enum: [30, 60, 90] // days
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active',
    index: true
  },
  nextDeliveryDate: {
    type: Date,
    required: true,
    index: true
  },
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod', 'mock'],
    default: 'mock'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
