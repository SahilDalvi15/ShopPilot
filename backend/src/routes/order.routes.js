const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middleware/validate');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/orderValidator');
const { createOrder, getOrders, getOrderById, cancelOrder } = require('../controllers/order.controller');

router.post('/', authenticate, validate(createOrderSchema), createOrder);
router.get('/', authenticate, getOrders);
router.get('/:orderId', authenticate, getOrderById);
router.put('/:orderId/cancel', authenticate, cancelOrder);

module.exports = router;
