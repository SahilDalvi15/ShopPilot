import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';

// Async thunks
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await reviewService.getProductReviews(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await reviewService.createReview(reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

export const markReviewHelpful = createAsyncThunk(
  'reviews/markReviewHelpful',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await reviewService.markReviewHelpful(reviewId);
      return { reviewId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark review as helpful');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewService.updateReview(reviewId, reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
    submitting: false,
    submittingError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSubmittingError: (state) => {
      state.submittingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data || action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create review
      .addCase(createReview.pending, (state) => {
        state.submitting = true;
        state.submittingError = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.reviews.unshift(action.payload.data || action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.submitting = false;
        state.submittingError = action.payload;
      })
      // Mark helpful
      .addCase(markReviewHelpful.fulfilled, (state, action) => {
        const { reviewId } = action.payload;
        const review = state.reviews.find((r) => r.id === reviewId);
        if (review) {
          review.helpfulCount = (review.helpfulCount || 0) + 1;
        }
      })
      // Update review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r.id === (action.payload.data?.id || action.payload.id)
        );
        if (index !== -1) {
          state.reviews[index] = action.payload.data || action.payload;
        }
      })
      // Delete review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r.id !== action.payload);
      });
  },
});

export const { clearError, clearSubmittingError } = reviewSlice.actions;
export default reviewSlice.reducer;
