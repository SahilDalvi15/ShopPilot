const Payment = require('../models/Payment.model');
const Order = require('../models/Order.model');
const razorpayUtils = require('../utils/razorpay');
const logger = require('../utils/logger');

/**
 * Create Razorpay order for payment
 * @param {Object} data - Order data
 * @param {string} data.orderId - Order ID
 * @param {number} data.amount - Amount in INR
 * @param {string} data.currency - Currency code
 * @returns {Promise<Object>} Razorpay order details
 */
const createPaymentOrder = async (data) => {
  try {
    const { orderId, amount, currency } = data;

    // Fetch order details
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Convert amount to paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order
    const razorpayOrder = await razorpayUtils.createOrder({
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        userId: order.userId.toString(),
      },
    });

    // Create payment record
    const payment = await Payment.create({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: currency || 'INR',
      status: 'pending',
      paymentMethod: 'razorpay',
    });

    logger.info('Payment order created', {
      paymentId: payment._id,
      razorpayOrderId: razorpayOrder.id,
      orderId,
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: razorpayOrder.currency,
      keyId: razorpayUtils.getKeyId(),
    };
  } catch (error) {
    logger.error('Error creating payment order', { error: error.message });
    throw error;
  }
};

/**
 * Verify payment and update order status
 * @param {Object} data - Payment verification data
 * @param {string} data.razorpayOrderId - Razorpay order ID
 * @param {string} data.razorpayPaymentId - Razorpay payment ID
 * @param {string} data.razorpaySignature - Razorpay signature
 * @returns {Promise<Object>} Verification result
 */
const verifyPayment = async (data) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;

    // Verify payment signature
    const isValid = razorpayUtils.verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      throw new Error('Invalid payment signature');
    }

    // Fetch payment details from Razorpay
    const paymentDetails = await razorpayUtils.fetchPayment(razorpayPaymentId);

    // Find payment record
    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      throw new Error('Payment record not found');
    }

    // Update payment record
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.status = paymentDetails.status === 'captured' ? 'success' : 'failed';
    payment.transactionId = paymentDetails.id;
    await payment.save();

    // Update order status if payment successful
    if (payment.status === 'success') {
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'success';
        order.paymentId = payment._id;
        order.orderStatus = 'confirmed';
        await order.save();
      }
    }

    logger.info('Payment verified', {
      paymentId: payment._id,
      status: payment.status,
      razorpayPaymentId,
    });

    return {
      success: true,
      paymentId: payment._id,
      status: payment.status,
    };
  } catch (error) {
    logger.error('Error verifying payment', { error: error.message });
    throw error;
  }
};

/**
 * Process refund for a payment
 * @param {Object} data - Refund data
 * @param {string} data.paymentId - Payment ID
 * @param {number} data.amount - Refund amount in INR (optional)
 * @param {string} data.reason - Refund reason
 * @returns {Promise<Object>} Refund details
 */
const processRefund = async (data) => {
  try {
    const { paymentId, amount, reason } = data;

    // Find payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'success') {
      throw new Error('Cannot refund unsuccessful payment');
    }

    if (payment.refundStatus === 'processed') {
      throw new Error('Refund already processed');
    }

    // Convert amount to paise
    const amountInPaise = amount ? Math.round(amount * 100) : payment.amount;

    // Initiate refund
    const refund = await razorpayUtils.initiateRefund(
      payment.razorpayPaymentId,
      amountInPaise
    );

    // Update payment record
    payment.refundId = refund.id;
    payment.refundAmount = refund.amount;
    payment.refundStatus = refund.status === 'processed' ? 'success' : 'pending';
    await payment.save();

    // Create refund record
    const Refund = require('../models/Refund.model');
    await Refund.create({
      orderId: payment.orderId,
      paymentId: payment._id,
      amount: refund.amount / 100, // Convert back to INR
      reason: reason || 'Customer requested refund',
      status: refund.status === 'processed' ? 'success' : 'pending',
    });

    logger.info('Refund processed', {
      paymentId: payment._id,
      refundId: refund.id,
      amount: refund.amount,
    });

    return {
      refundId: refund.id,
      amount: refund.amount / 100,
      status: payment.refundStatus,
    };
  } catch (error) {
    logger.error('Error processing refund', { error: error.message });
    throw error;
  }
};

/**
 * Get payment details
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} Payment details
 */
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId)
      .populate('orderId', 'orderNumber totalAmount orderStatus')
      .lean();

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  } catch (error) {
    logger.error('Error fetching payment details', { error: error.message });
    throw error;
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  processRefund,
  getPaymentDetails,
};
