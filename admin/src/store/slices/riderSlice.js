import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  riders: [],
  rider: null,
  loading: false,
  error: null,
  success: false,
};

// Get all riders
export const getAllRiders = createAsyncThunk(
  'riders/getAllRiders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.get('/api/admin/riders', config);
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

// Get rider details
export const getRiderDetails = createAsyncThunk(
  'riders/getRiderDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.get(`/api/admin/users/${id}`, config);
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

// Get rider orders
export const getRiderOrders = createAsyncThunk(
  'riders/getRiderOrders',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const { data } = await axios.get(`/api/admin/riders/${id}/orders`, config);
      return { riderId: id, orders: data.data };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const riderSlice = createSlice({
  name: 'riders',
  initialState,
  reducers: {
    clearRiderError: (state) => {
      state.error = null;
    },
    resetRiderSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all riders
      .addCase(getAllRiders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRiders.fulfilled, (state, action) => {
        state.loading = false;
        state.riders = action.payload;
      })
      .addCase(getAllRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get rider details
      .addCase(getRiderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRiderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.rider = action.payload;
      })
      .addCase(getRiderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get rider orders
      .addCase(getRiderOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRiderOrders.fulfilled, (state, action) => {
        state.loading = false;
        
        // Find rider and add orders
        const index = state.riders.findIndex(
          (rider) => rider._id === action.payload.riderId
        );
        
        if (index !== -1) {
          state.riders[index].orders = action.payload.orders;
        }
        
        // Update current rider if it matches
        if (state.rider && state.rider._id === action.payload.riderId) {
          state.rider.orders = action.payload.orders;
        }
      })
      .addCase(getRiderOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRiderError, resetRiderSuccess } = riderSlice.actions;

export default riderSlice.reducer;
