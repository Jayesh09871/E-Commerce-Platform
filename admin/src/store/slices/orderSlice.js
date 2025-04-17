import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
};

// Get all orders
export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.get('/api/orders', config);
      return data.data;
    } catch (error) {
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
      const { auth } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.get(`/api/orders/${id}`, config);
      return data.data;
    } catch (error) {
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
  async ({ id, status, riderId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${id}/status`,
        { status, riderId },
        config
      );
      
      return data.data;
    } catch (error) {
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
      // Get all orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
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
