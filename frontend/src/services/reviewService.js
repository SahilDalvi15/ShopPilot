import api from './api';

const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId) => {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },

  // Create a new review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Mark review as helpful
  markReviewHelpful: async (reviewId) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};

export default reviewService;
