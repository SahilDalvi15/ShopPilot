import apiClient from './api';

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  addToCart: async (cartData) => {
    const response = await apiClient.post('/cart/items', cartData);
    return response.data;
  },

  updateCartItem: async (productId, quantity) => {
    const response = await apiClient.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await apiClient.delete(`/cart/items/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete('/cart');
    return response.data;
  },

  applyCoupon: async (code) => {
    const response = await apiClient.post('/cart/coupon', { code });
    return response.data;
  },

  removeCoupon: async () => {
    const response = await apiClient.delete('/cart/coupon');
    return response.data;
  },
};
