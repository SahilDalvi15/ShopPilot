const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Order ID is required'],
    ref: 'Order',
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'User',
    index: true
  },
  razorpayOrderId: {
    type: String,
    unique: true,
    index: true
  },
  razorpayPaymentId: {
    type: String,
    unique: true,
    index: true
  },
  razorpaySignature: String,
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentMethod: String,
  paymentDate: Date,
  failureReason: String,
  refundId: String,
  refundAmount: Number,
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'success', 'failed'],
    default: 'none'
  },
  refundDate: Date,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
