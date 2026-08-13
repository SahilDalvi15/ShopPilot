import api from './api';

const adminReviewService = {
  getAllReviews: async (params) => {
    const response = await api.get('/reviews/admin/all', { params });
    return response.data;
  },
  
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

export default adminReviewService;
