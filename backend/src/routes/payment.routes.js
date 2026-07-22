const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * @route   POST /api/v1/payments/create-order
 * @desc    Create Razorpay payment order
 * @access  Private
 */
router.post('/create-order', authenticate, paymentController.createPaymentOrder);

/**
 * @route   POST /api/v1/payments/verify
 * @desc    Verify Razorpay payment
 * @access  Private
 */
router.post('/verify', authenticate, paymentController.verifyPayment);

/**
 * @route   POST /api/v1/payments/refund
 * @desc    Process refund
 * @access  Private
 */
router.post('/refund', authenticate, paymentController.processRefund);

/**
 * @route   GET /api/v1/payments/:paymentId
 * @desc    Get payment details
 * @access  Private
 */
router.get('/:paymentId', authenticate, paymentController.getPaymentDetails);

/**
 * @route   GET /api/v1/payments/key
 * @desc    Get Razorpay key ID (for frontend)
 * @access  Public
 */
router.get('/key', paymentController.getRazorpayKey);

/**
 * @route   POST /api/v1/payments/webhook
 * @desc    Razorpay webhook handler
 * @access  Public
 */
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
