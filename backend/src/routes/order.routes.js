const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { createOrder, getOrders, getOrderById, cancelOrder } = require('../controllers/order.controller');

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:orderId', authenticate, getOrderById);
router.put('/:orderId/cancel', authenticate, cancelOrder);

module.exports = router;
