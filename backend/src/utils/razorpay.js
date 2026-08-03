// Razorpay integration removed - using COD only
// This file is kept for future reference if Razorpay is needed

const logger = require('./logger');

/**
 * Create Razorpay order (disabled - using COD only)
 */
const createOrder = async (options) => {
  throw new Error('Razorpay payment is disabled. Using COD only.');
};

/**
 * Verify Razorpay payment signature (disabled - using COD only)
 */
const verifyPayment = (orderId, paymentId, signature) => {
  throw new Error('Razorpay payment is disabled. Using COD only.');
};

/**
 * Fetch payment details from Razorpay (disabled - using COD only)
 */
const fetchPayment = async (paymentId) => {
  throw new Error('Razorpay payment is disabled. Using COD only.');
};

/**
 * Initiate refund for a payment (disabled - using COD only)
 */
const initiateRefund = async (paymentId, amount) => {
  throw new Error('Razorpay payment is disabled. Using COD only.');
};

/**
 * Get Razorpay key ID (disabled - using COD only)
 */
const getKeyId = () => {
  return null;
};

module.exports = {
  createOrder,
  verifyPayment,
  fetchPayment,
  initiateRefund,
  getKeyId,
};
