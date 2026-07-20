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

const statusHistorySchema = new mongoose.Schema({
  status: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const couponSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  code: String,
  discountAmount: Number
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: [true, 'Order number is required'],
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'User',
    index: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem'
  }],
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required']
  },
  discount: {
    type: Number,
    default: 0
  },
  shippingCharge: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod'],
    default: 'razorpay'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending',
    index: true
  },
  statusHistory: [statusHistorySchema],
  coupon: couponSchema,
  estimatedDelivery: Date,
  actualDelivery: Date,
  cancellationReason: String,
  returnReason: String,
  notes: String
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1, orderStatus: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    this.orderNumber = `ORD${year}${month}${day}${random}`;
  }
  
  // Add status to history if changed
  if (this.isModified('orderStatus')) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      note: `Order status changed to ${this.orderStatus}`
    });
  }
  
  next();
});

module.exports = mongoose.model('Order', orderSchema);
