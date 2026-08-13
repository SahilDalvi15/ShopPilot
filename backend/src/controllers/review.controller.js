const reviewService = require('../services/review.service');

const getProductReviews = async (req, res) => {
  try {
    const result = await reviewService.getProductReviews(req.params.productId, req.query);
    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: result.reviews,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve reviews',
      error: {
        code: error.code || 'GET_REVIEWS_ERROR'
      }
    });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const result = await reviewService.getAllReviews(req.query);
    res.status(200).json({
      success: true,
      message: 'All reviews retrieved successfully',
      data: result.reviews,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve all reviews',
      error: {
        code: error.code || 'GET_ALL_REVIEWS_ERROR'
      }
    });
  }
};

const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create review',
      error: {
        code: error.code || 'CREATE_REVIEW_ERROR'
      }
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(req.user.id, req.params.reviewId, req.body);
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update review',
      error: {
        code: error.code || 'UPDATE_REVIEW_ERROR'
      }
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.user.id, req.params.reviewId);
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete review',
      error: {
        code: error.code || 'DELETE_REVIEW_ERROR'
      }
    });
  }
};

const markHelpful = async (req, res) => {
  try {
    await reviewService.markHelpful(req.user.id, req.params.reviewId, req.body.helpful);
    res.status(200).json({
      success: true,
      message: 'Review marked successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to mark review',
      error: {
        code: error.code || 'MARK_REVIEW_ERROR'
      }
    });
  }
};

module.exports = {
  getProductReviews,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
};
