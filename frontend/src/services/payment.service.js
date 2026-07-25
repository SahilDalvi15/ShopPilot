import apiClient from './api';

export const paymentService = {
  getRazorpayKey: async () => {
    const response = await apiClient.get('/payments/key');
    return response.data;
  },

  createPaymentOrder: async (orderData) => {
    const response = await apiClient.post('/payments/create-order', orderData);
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await apiClient.post('/payments/verify', paymentData);
    return response.data;
  },

  getPaymentDetails: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response.data;
  },

  processRefund: async (refundData) => {
    const response = await apiClient.post('/payments/refund', refundData);
    return response.data;
  },
};
