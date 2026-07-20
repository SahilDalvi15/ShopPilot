const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon, removeCoupon } = require('../controllers/cart.controller');

router.get('/', authenticate, getCart);
router.post('/items', authenticate, addToCart);
router.put('/items/:productId', authenticate, updateCartItem);
router.delete('/items/:productId', authenticate, removeFromCart);
router.delete('/', authenticate, clearCart);
router.post('/coupon', authenticate, applyCoupon);
router.delete('/coupon', authenticate, removeCoupon);

module.exports = router;
