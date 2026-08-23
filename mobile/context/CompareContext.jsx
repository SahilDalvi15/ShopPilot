import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  useEffect(() => {
    loadCompareItems();
  }, []);

  const loadCompareItems = async () => {
    try {
      const stored = await AsyncStorage.getItem('compareItems');
      if (stored) {
        setCompareItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading compare items', error);
    }
  };

  const saveCompareItems = async (items) => {
    try {
      await AsyncStorage.setItem('compareItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving compare items', error);
    }
  };

  const addToCompare = (product) => {
    if (compareItems.length >= 3) {
      return { success: false, message: 'You can only compare up to 3 items at a time' };
    }
    
    if (compareItems.some(item => item._id === product._id)) {
      return { success: false, message: 'Item is already in compare list' };
    }

    const newItems = [...compareItems, product];
    setCompareItems(newItems);
    saveCompareItems(newItems);
    return { success: true, message: 'Added to compare' };
  };

  const removeFromCompare = (productId) => {
    const newItems = compareItems.filter(item => item._id !== productId);
    setCompareItems(newItems);
    saveCompareItems(newItems);
  };

  const clearCompare = () => {
    setCompareItems([]);
    AsyncStorage.removeItem('compareItems');
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
