const paymentService = require('../services/payment.service');
const logger = require('../utils/logger');
const crypto = require('crypto');

/**
 * Create payment order
 * @route POST /api/v1/payments/create-order
 */
const createPaymentOrder = async (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'orderId and amount are required',
      });
    }

    const orderDetails = await paymentService.createPaymentOrder({
      orderId,
      amount,
      currency,
    });

    res.status(200).json({
      success: true,
      message: 'Payment order created successfully',
      data: orderDetails,
    });
  } catch (error) {
    logger.error('Error in createPaymentOrder controller', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order',
    });
  }
};

/**
 * Verify payment
 * @route POST /api/v1/payments/verify
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'razorpayOrderId, razorpayPaymentId, and razorpaySignature are required',
      });
    }

    const verificationResult = await paymentService.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: verificationResult,
    });
  } catch (error) {
    logger.error('Error in verifyPayment controller', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
};

/**
 * Process refund
 * @route POST /api/v1/payments/refund
 */
const processRefund = async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'paymentId is required',
      });
    }

    const refundDetails = await paymentService.processRefund({
      paymentId,
      amount,
      reason,
    });

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: refundDetails,
    });
  } catch (error) {
    logger.error('Error in processRefund controller', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process refund',
    });
  }
};

/**
 * Get payment details
 * @route GET /api/v1/payments/:paymentId
 */
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await paymentService.getPaymentDetails(paymentId);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    logger.error('Error in getPaymentDetails controller', { error: error.message });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payment details',
    });
  }
};

/**
 * Get Razorpay key ID (for frontend)
 * @route GET /api/v1/payments/key
 */
const getRazorpayKey = async (req, res) => {
  try {
    const razorpayUtils = require('../utils/razorpay');
    const keyId = razorpayUtils.getKeyId();

    res.status(200).json({
      success: true,
      data: { keyId },
    });
  } catch (error) {
    logger.error('Error in getRazorpayKey controller', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Razorpay key',
    });
  }
};

/**
 * Razorpay webhook handler
 * @route POST /api/v1/payments/webhook
 */
const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const webhookBody = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      logger.error('Invalid webhook signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const event = req.body;
    logger.info('Webhook received', { event: event.event });

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event);
        break;
      case 'refund.processed':
        await handleRefundProcessed(event);
        break;
      default:
        logger.info('Unhandled webhook event', { event: event.event });
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    logger.error('Error in handleWebhook controller', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
    });
  }
};

/**
 * Handle payment captured event
 */
const handlePaymentCaptured = async (event) => {
  const { payload } = event;
  const { payment } = payload;
  const { entity } = payment;

  const Payment = require('../models/Payment.model');
  const Order = require('../models/Order.model');

  // Find payment record
  const paymentRecord = await Payment.findOne({ razorpayOrderId: entity.order_id });
  if (!paymentRecord) {
    logger.error('Payment record not found for webhook', { orderId: entity.order_id });
    return;
  }

  // Update payment record
  paymentRecord.razorpayPaymentId = entity.id;
  paymentRecord.status = 'success';
  paymentRecord.transactionId = entity.id;
  await paymentRecord.save();

  // Update order status
  const order = await Order.findById(paymentRecord.orderId);
  if (order) {
    order.paymentStatus = 'success';
    order.paymentId = paymentRecord._id;
    order.orderStatus = 'confirmed';
    await order.save();
    logger.info('Order status updated via webhook', { orderId: order._id });
  }
};

/**
 * Handle payment failed event
 */
const handlePaymentFailed = async (event) => {
  const { payload } = event;
  const { payment } = payload;
  const { entity } = payment;

  const Payment = require('../models/Payment.model');
  const Order = require('../models/Order.model');

  // Find payment record
  const paymentRecord = await Payment.findOne({ razorpayOrderId: entity.order_id });
  if (!paymentRecord) {
    logger.error('Payment record not found for webhook', { orderId: entity.order_id });
    return;
  }

  // Update payment record
  paymentRecord.razorpayPaymentId = entity.id;
  paymentRecord.status = 'failed';
  paymentRecord.transactionId = entity.id;
  await paymentRecord.save();

  // Update order status
  const order = await Order.findById(paymentRecord.orderId);
  if (order) {
    order.paymentStatus = 'failed';
    order.orderStatus = 'cancelled';
    await order.save();
    logger.info('Order status updated via webhook (failed)', { orderId: order._id });
  }
};

/**
 * Handle refund processed event
 */
const handleRefundProcessed = async (event) => {
  const { payload } = event;
  const { refund } = payload;
  const { entity } = refund;

  const Payment = require('../models/Payment.model');
  const Refund = require('../models/Refund.model');

  // Find payment record
  const paymentRecord = await Payment.findOne({ razorpayPaymentId: entity.payment_id });
  if (!paymentRecord) {
    logger.error('Payment record not found for refund webhook', { paymentId: entity.payment_id });
    return;
  }

  // Update payment record
  paymentRecord.refundId = entity.id;
  paymentRecord.refundAmount = entity.amount;
  paymentRecord.refundStatus = 'success';
  await paymentRecord.save();

  // Update refund record
  const refundRecord = await Refund.findOne({ paymentId: paymentRecord._id });
  if (refundRecord) {
    refundRecord.status = 'success';
    refundRecord.processedAt = new Date();
    await refundRecord.save();
    logger.info('Refund status updated via webhook', { refundId: entity.id });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  processRefund,
  getPaymentDetails,
  getRazorpayKey,
  handleWebhook,
};
