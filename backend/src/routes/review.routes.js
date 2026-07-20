const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { getProductReviews, createReview, updateReview, deleteReview, markHelpful } = require('../controllers/review.controller');

router.get('/product/:productId', getProductReviews);
router.post('/', authenticate, createReview);
router.put('/:reviewId', authenticate, updateReview);
router.delete('/:reviewId', authenticate, deleteReview);
router.post('/:reviewId/helpful', authenticate, markHelpful);

module.exports = router;
