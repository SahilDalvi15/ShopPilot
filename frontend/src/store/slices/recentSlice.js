import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('recentlyViewed')) || [],
};

const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    addRecentlyViewed: (state, action) => {
      const product = action.payload;
      // Remove if it already exists
      state.items = state.items.filter(item => item.id !== product.id);
      
      // Add to the front
      state.items.unshift(product);
      
      // Limit to 10 items
      if (state.items.length > 10) {
        state.items.pop();
      }
      
      localStorage.setItem('recentlyViewed', JSON.stringify(state.items));
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
      localStorage.removeItem('recentlyViewed');
    }
  }
});

export const { addRecentlyViewed, clearRecentlyViewed } = recentSlice.actions;

export const selectRecentItems = (state) => state.recent.items;

export default recentSlice.reducer;
