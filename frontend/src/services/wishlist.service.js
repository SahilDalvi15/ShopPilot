import apiClient from './api';

export const wishlistService = {
  getWishlist: async () => {
    const response = await apiClient.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await apiClient.post('/wishlist/items', { productId });
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await apiClient.delete(`/wishlist/items/${productId}`);
    return response.data;
  },

  clearWishlist: async () => {
    const response = await apiClient.delete('/wishlist');
    return response.data;
  },

  moveToCart: async (productId) => {
    const response = await apiClient.post(`/wishlist/items/${productId}/move-to-cart`);
    return response.data;
  },
};
