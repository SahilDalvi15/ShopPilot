import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        // Fetch user from backend if token exists
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
        }
      }
    } catch (error) {
      console.error('Failed to load user', error);
      await SecureStore.deleteItemAsync('accessToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user: userData, tokens } = res.data.data;
        const accessToken = tokens?.accessToken || res.data.data.accessToken;
        
        if (accessToken) {
          await SecureStore.setItemAsync('accessToken', accessToken);
        }
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {}
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
