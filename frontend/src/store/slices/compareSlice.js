import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('compareItems')) || [],
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item.id === product.id);
      
      if (exists) {
        return; // Already in compare list
      }
      
      if (state.items.length >= 3) {
        throw new Error('You can only compare up to 3 products at a time.');
      }
      
      state.items.push(product);
      localStorage.setItem('compareItems', JSON.stringify(state.items));
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('compareItems', JSON.stringify(state.items));
    },
    clearCompare: (state) => {
      state.items = [];
      localStorage.removeItem('compareItems');
    }
  }
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;

export const selectCompareItems = (state) => state.compare.items;

export default compareSlice.reducer;
