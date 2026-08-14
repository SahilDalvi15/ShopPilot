const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { getWishlist, addToWishlist, removeFromWishlist, moveToCart, generateShareToken, getSharedWishlist } = require('../controllers/wishlist.controller');

// Public route for shared wishlist
router.get('/shared/:token', getSharedWishlist);

router.get('/', authenticate, getWishlist);
router.post('/items', authenticate, addToWishlist);
router.delete('/items/:productId', authenticate, removeFromWishlist);
router.post('/items/:productId/move-to-cart', authenticate, moveToCart);
router.post('/share', authenticate, generateShareToken);

module.exports = router;
