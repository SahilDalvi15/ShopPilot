import apiClient from './api';

export const wishlistService = {
  getWishlist: async () => {
    const response = await apiClient.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await apiClient.post('/wishlist', { productId });
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await apiClient.delete(`/wishlist/${productId}`);
    return response.data;
  },

  clearWishlist: async () => {
    const response = await apiClient.delete('/wishlist');
    return response.data;
  },

  moveAllToCart: async () => {
    const response = await apiClient.post('/wishlist/move-to-cart');
    return response.data;
  },
};
