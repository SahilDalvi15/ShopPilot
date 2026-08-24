import api from './api';

const adminOrderService = {
  // Get all orders (admin view)
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders/admin/all', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/admin/${orderId}/status`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Export CSV
  exportCsv: async () => {
    const response = await api.get('/orders/admin/export/csv', { responseType: 'blob' });
    return response.data;
  },
};

export default adminOrderService;
