import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cart.service';

const initialState = {
  items: [],
  subtotal: 0,
  totalDiscount: 0,
  totalAmount: 0,
  appliedCoupon: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, { dispatch, rejectWithValue }) => {
    try {
      await cartService.addToCart(cartData);
      // Re-fetch the full cart so Redux state has all items with product details
      const fullCart = await cartService.getCart();
      return fullCart.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      await cartService.updateCartItem(itemId, quantity);
      // Re-fetch the full cart so Redux state stays in sync
      const fullCart = await cartService.getCart();
      return fullCart.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await cartService.removeFromCart(itemId);
      // Re-fetch the full cart so Redux state stays in sync
      const fullCart = await cartService.getCart();
      return fullCart.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

export const applyCouponAsync = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await cartService.applyCoupon(couponCode);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply coupon');
    }
  }
);

export const removeCouponAsync = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.removeCoupon();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove coupon');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.subtotal = action.payload.subtotal;
      state.totalDiscount = action.payload.totalDiscount;
      state.totalAmount = action.payload.totalAmount;
      state.appliedCoupon = action.payload.appliedCoupon;
      state.loading = false;
      state.error = null;
    },
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    updateItemQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      cartSlice.caseReducers.calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalDiscount = 0;
      state.totalAmount = 0;
      state.appliedCoupon = null;
    },
    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      cartSlice.caseReducers.calculateTotals(state);
    },
    calculateTotals: (state) => {
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.totalDiscount = state.items.reduce(
        (sum, item) =>
          sum +
          (item.discountedPrice
            ? (item.price - item.discountedPrice) * item.quantity
            : 0),
        0
      );
      if (state.appliedCoupon) {
        state.totalDiscount += state.appliedCoupon.discountAmount;
      }
      state.totalAmount = state.subtotal - state.totalDiscount;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.totalDiscount = action.payload.totalDiscount || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.appliedCoupon = action.payload.appliedCoupon || null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.totalDiscount = action.payload.totalDiscount || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.appliedCoupon = action.payload.appliedCoupon || null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.totalDiscount = action.payload.totalDiscount || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.appliedCoupon = action.payload.appliedCoupon || null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.totalDiscount = action.payload.totalDiscount || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        state.appliedCoupon = action.payload.appliedCoupon || null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear cart
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.subtotal = 0;
        state.totalDiscount = 0;
        state.totalAmount = 0;
        state.appliedCoupon = null;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply coupon
      .addCase(applyCouponAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyCouponAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.coupon;
        state.totalDiscount = action.payload.totalDiscount;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(applyCouponAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove coupon
      .addCase(removeCouponAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCouponAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = null;
        state.totalDiscount = action.payload.totalDiscount;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(removeCouponAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalAmount;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
