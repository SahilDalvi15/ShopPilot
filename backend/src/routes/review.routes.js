const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middleware/validate');
const { createReviewSchema, updateReviewSchema } = require('../validators/reviewValidator');
const { getProductReviews, getAllReviews, createReview, updateReview, deleteReview, markHelpful } = require('../controllers/review.controller');

router.get('/product/:productId', getProductReviews);
router.get('/admin/all', authenticate, authorize('admin', 'super_admin'), getAllReviews);
router.post('/', authenticate, validate(createReviewSchema), createReview);
router.put('/:reviewId', authenticate, validate(updateReviewSchema), updateReview);
router.delete('/:reviewId', authenticate, deleteReview);
router.post('/:reviewId/helpful', authenticate, markHelpful);

module.exports = router;
