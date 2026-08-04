const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Order ID is required'],
    ref: 'Order',
    index: true
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Payment ID is required'],
    ref: 'Payment'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'User',
    index: true
  },
  refundAmount: {
    type: Number,
    required: [true, 'Refund amount is required']
  },
  refundReason: {
    type: String,
    required: [true, 'Refund reason is required']
  },
  refundType: {
    type: String,
    enum: ['full', 'partial'],
    required: [true, 'Refund type is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  razorpayRefundId: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: Date,
  rejectionReason: String,
  completedAt: Date,
  notes: String
}, {
  timestamps: true
});

// IndexesrefundSchema.index({ paymentId: 1 });refundSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Refund', refundSchema);
