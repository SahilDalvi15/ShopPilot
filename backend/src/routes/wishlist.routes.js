const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { getWishlist, addToWishlist, removeFromWishlist, moveToCart } = require('../controllers/wishlist.controller');

router.get('/', authenticate, getWishlist);
router.post('/items', authenticate, addToWishlist);
router.delete('/items/:productId', authenticate, removeFromWishlist);
router.post('/items/:productId/move-to-cart', authenticate, moveToCart);

module.exports = router;
