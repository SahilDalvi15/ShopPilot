import api from './api';

const adminStatsService = {
  // Get all admin dashboard stats
  getAdminStats: async () => {
    const response = await api.get('/stats/admin');
    return response.data;
  },
};

export default adminStatsService;
