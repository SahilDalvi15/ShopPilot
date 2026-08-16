import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import addressReducer from './slices/addressSlice';
import paymentReducer from './slices/paymentSlice';
import reviewReducer from './slices/reviewSlice';
import compareReducer from './slices/compareSlice';
import recentReducer from './slices/recentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    payment: paymentReducer,
    reviews: reviewReducer,
    compare: compareReducer,
    recent: recentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;
