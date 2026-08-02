import api from './api';

const adminUserService = {
  // Get all users (admin view)
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Block/Unblock user
  toggleUserBlock: async (userId, isBlocked) => {
    const response = await api.put(`/users/${userId}/block`, { isBlocked });
    return response.data;
  },
};

export default adminUserService;
