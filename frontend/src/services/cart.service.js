import apiClient from './api';

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  addToCart: async (cartData) => {
    const response = await apiClient.post('/cart', cartData);
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await apiClient.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await apiClient.delete(`/cart/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete('/cart');
    return response.data;
  },

  applyCoupon: async (couponCode) => {
    const response = await apiClient.post('/cart/apply-coupon', { couponCode });
    return response.data;
  },

  removeCoupon: async () => {
    const response = await apiClient.delete('/cart/coupon');
    return response.data;
  },
};
