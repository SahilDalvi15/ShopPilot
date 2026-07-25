import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentService } from '../../services/payment.service';

const initialState = {
  orderId: null,
  keyId: null,
  amount: null,
  loading: false,
  error: null,
};

// Async thunks
export const createPaymentOrder = createAsyncThunk(
  'payment/createPaymentOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await paymentService.createPaymentOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment order');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentService.verifyPayment(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify payment');
    }
  }
);

export const getPaymentDetails = createAsyncThunk(
  'payment/getPaymentDetails',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await paymentService.getPaymentDetails(paymentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment details');
    }
  }
);

export const processRefund = createAsyncThunk(
  'payment/processRefund',
  async (refundData, { rejectWithValue }) => {
    try {
      const response = await paymentService.processRefund(refundData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process refund');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPayment: (state) => {
      state.orderId = null;
      state.keyId = null;
      state.amount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create payment order
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderId = action.payload.orderId;
        state.keyId = action.payload.keyId;
        state.amount = action.payload.amount;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get payment details
      .addCase(getPaymentDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPaymentDetails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Process refund
      .addCase(processRefund.pending, (state) => {
        state.loading = true;
      })
      .addCase(processRefund.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
