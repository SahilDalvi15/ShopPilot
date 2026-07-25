import apiClient from './api';

export const orderService = {
  getOrders: async (params = {}) => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await apiClient.post(`/orders/${orderId}/cancel`);
    return response.data;
  },

  trackOrder: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/track`);
    return response.data;
  },

  returnOrder: async (orderId, returnData) => {
    const response = await apiClient.post(`/orders/${orderId}/return`, returnData);
    return response.data;
  },
};
