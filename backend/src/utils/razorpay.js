const Razorpay = require('razorpay');
const logger = require('./logger');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay order
 * @param {Object} options - Order options
 * @param {number} options.amount - Amount in paise (1 INR = 100 paise)
 * @param {string} options.currency - Currency code (default: INR)
 * @param {string} options.receipt - Receipt ID
 * @param {Object} options.notes - Additional notes
 * @returns {Promise<Object>} Razorpay order
 */
const createOrder = async (options) => {
  try {
    const orderOptions = {
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt,
      notes: options.notes || {},
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(orderOptions);
    logger.info('Razorpay order created', { orderId: order.id, receipt: options.receipt });
    return order;
  } catch (error) {
    logger.error('Error creating Razorpay order', { error: error.message });
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} Verification result
 */
const verifyPayment = (orderId, paymentId, signature) => {
  try {
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = generatedSignature === signature;
    logger.info('Payment verification', { orderId, paymentId, isValid });
    return isValid;
  } catch (error) {
    logger.error('Error verifying payment signature', { error: error.message });
    throw new Error('Payment verification failed');
  }
};

/**
 * Fetch payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
const fetchPayment = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    logger.info('Payment details fetched', { paymentId, status: payment.status });
    return payment;
  } catch (error) {
    logger.error('Error fetching payment details', { error: error.message });
    throw new Error('Failed to fetch payment details');
  }
};

/**
 * Initiate refund for a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Refund amount in paise (optional, full refund if not provided)
 * @returns {Promise<Object>} Refund details
 */
const initiateRefund = async (paymentId, amount) => {
  try {
    const refundOptions = {
      payment_id: paymentId,
    };

    if (amount) {
      refundOptions.amount = amount;
    }

    const refund = await razorpay.payments.refund(refundOptions);
    logger.info('Refund initiated', { paymentId, refundId: refund.id });
    return refund;
  } catch (error) {
    logger.error('Error initiating refund', { error: error.message });
    throw new Error('Failed to initiate refund');
  }
};

/**
 * Get Razorpay key ID (for frontend)
 * @returns {string} Razorpay key ID
 */
const getKeyId = () => {
  return process.env.RAZORPAY_KEY_ID;
};

module.exports = {
  createOrder,
  verifyPayment,
  fetchPayment,
  initiateRefund,
  getKeyId,
};
