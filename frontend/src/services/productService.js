import api from '../lib/api';

export const productService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (productId, productData) => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  getSearchSuggestions: async (query) => {
    if (!query || query.length < 2) return { data: { suggestions: [] } };
    const response = await api.get('/search/suggestions', { params: { q: query } });
    return response.data;
  },
};
