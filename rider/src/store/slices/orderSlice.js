import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
};

// Get assigned orders for the rider
export const getAssignedOrders = createAsyncThunk(
  'orders/getAssignedOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      // We don't need to pass the token in config as it's handled by axiosInstance interceptor
      const { data } = await axiosInstance.get('/api/rider/orders');
      
      // Ensure we return an array even if the API doesn't return data
      return data && data.data ? data.data : [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get order details
export const getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      // Token is handled by axiosInstance interceptor
      const { data } = await axiosInstance.get(`/api/rider/orders/${id}`);
      return data.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status, notes }, { getState, rejectWithValue }) => {
    try {
      // Token and Content-Type are handled by axiosInstance interceptor
      const { data } = await axiosInstance.put(
        `/api/rider/orders/${id}/status`,
        { status, notes }
      );
      
      return data.data;
    } catch (error) {
      console.error(`Error updating order ${id} status:`, error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get assigned orders
      .addCase(getAssignedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssignedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAssignedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        // Update order in orders array
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        
        // Update current order if it matches
        if (state.order && state.order._id === action.payload._id) {
          state.order = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearOrderError, resetOrderSuccess } = orderSlice.actions;

export default orderSlice.reducer;
