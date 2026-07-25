import apiClient from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getProductBySlug: async (slug) => {
    const response = await apiClient.get(`/products/slug/${slug}`);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  getBrands: async () => {
    const response = await apiClient.get('/brands');
    return response.data;
  },

  searchProducts: async (query) => {
    const response = await apiClient.get('/products/search', { params: { q: query } });
    return response.data;
  },

  getProductReviews: async (productId) => {
    const response = await apiClient.get(`/products/${productId}/reviews`);
    return response.data;
  },

  addProductReview: async (productId, reviewData) => {
    const response = await apiClient.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  },
};
