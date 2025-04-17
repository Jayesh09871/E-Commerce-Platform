import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')) : null,
  token: localStorage.getItem('adminToken') || null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,
  error: null,
};

// Login admin
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        '/api/auth/login',
        { email, password },
        config
      );

      console.log('Login response:', response.data);
      
      // Handle different response structures
      const userData = response.data.data || response.data;
      const user = userData.user;
      const token = userData.token;
      
      // Check if user exists and is admin
      if (!user || user.role !== 'admin') {
        return rejectWithValue('Not authorized as admin');
      }

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));

      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Logout admin
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
