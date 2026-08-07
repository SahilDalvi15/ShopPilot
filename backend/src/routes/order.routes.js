const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middleware/validate');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/orderValidator');
const { createOrder, getOrders, getOrderById, cancelOrder, adminGetOrders, adminUpdateOrderStatus } = require('../controllers/order.controller');

router.post('/', authenticate, validate(createOrderSchema), createOrder);
router.get('/', authenticate, getOrders);

// Admin Routes (must be before /:orderId to avoid route conflicts)
router.get('/admin/all', authenticate, authorize(['admin', 'super_admin']), adminGetOrders);
router.put('/admin/:orderId/status', authenticate, authorize(['admin', 'super_admin']), adminUpdateOrderStatus);

router.get('/:orderId', authenticate, getOrderById);
router.put('/:orderId/cancel', authenticate, cancelOrder);

module.exports = router;
