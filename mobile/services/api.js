import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Use your local IP for development (e.g., 192.168.1.5). 
// Don't use localhost or 127.0.0.1 for Android emulator/physical devices.
// Usually 10.0.2.2 works for Android Emulator to access host localhost.
const API_URL = 'http://10.0.2.2:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Though mobile handles cookies differently, we pass token in header
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We will implement refresh token logic here if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
            headers: { Cookie: `refreshToken=${refreshToken}` } // Emulate cookie or pass token
          });
          
          if (res.data.success) {
            await SecureStore.setItemAsync('accessToken', res.data.data.accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Handle logout
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
