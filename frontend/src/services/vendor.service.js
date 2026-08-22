import api from './api';

const vendorService = {
  // Register a new vendor store
  registerVendor: async (vendorData) => {
    const response = await api.post('/vendors/register', vendorData);
    return response.data;
  },

  // Get vendor dashboard stats (for logged in vendor)
  getVendorDashboard: async () => {
    const response = await api.get('/vendors/me');
    return response.data;
  },

  // Get public vendor store by slug
  getVendorStore: async (slug) => {
    const response = await api.get(`/vendors/store/${slug}`);
    return response.data;
  },

  // Get all vendors (Admin only)
  getVendors: async () => {
    const response = await api.get('/vendors');
    return response.data;
  }
};

export default vendorService;
