import apiClient from './api';

export const addressService = {
  getAddresses: async () => {
    const response = await apiClient.get('/addresses');
    return response.data;
  },

  getAddressById: async (addressId) => {
    const response = await apiClient.get(`/addresses/${addressId}`);
    return response.data;
  },

  createAddress: async (addressData) => {
    const response = await apiClient.post('/addresses', addressData);
    return response.data;
  },

  updateAddress: async (addressId, addressData) => {
    const response = await apiClient.put(`/addresses/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await apiClient.delete(`/addresses/${addressId}`);
    return response.data;
  },

  setDefaultAddress: async (addressId) => {
    const response = await apiClient.patch(`/addresses/${addressId}/default`);
    return response.data;
  },
};
