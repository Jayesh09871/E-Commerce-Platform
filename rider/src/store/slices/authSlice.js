import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

const initialState = {
  user: localStorage.getItem('riderUser') ? JSON.parse(localStorage.getItem('riderUser')) : null,
  token: localStorage.getItem('riderToken') || null,
  isAuthenticated: !!localStorage.getItem('riderToken'),
  loading: false,
  error: null,
};

// Login rider
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Direct API call without additional configuration
      const response = await axiosInstance.post('auth/login', { 
        email, 
        password 
      });

      console.log('Login response:', response.data);
      
      // Extract user and token from response
      // Handle different response structures
      const responseData = response.data;
      const token = responseData.token;
      const user = responseData.user || (responseData.data && responseData.data.user);
      
      // Check if user exists and is rider
      if (!user || user.role !== 'rider') {
        return rejectWithValue('Not authorized as rider');
      }

      // Store in localStorage
      localStorage.setItem('riderToken', token);
      localStorage.setItem('riderUser', JSON.stringify(user));

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Logout rider
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('riderToken');
  localStorage.removeItem('riderUser');
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
