import api from './api';

export const subscriptionService = {
  getSubscriptions: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  updateSubscriptionStatus: async (id, status) => {
    const response = await api.put(`/subscriptions/${id}/status`, { status });
    return response.data;
  }
};
