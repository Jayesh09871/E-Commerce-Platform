import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  totalProducts: 0,
};

// Get all products
export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (params, { rejectWithValue }) => {
    try {
      const { category, brand, minPrice, maxPrice, featured, sort, page = 1, limit = 10 } = params || {};
      
      let url = `/api/products?page=${page}&limit=${limit}`;
      if (category) url += `&category=${category}`;
      if (brand) url += `&brand=${brand}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (featured) url += `&featured=${featured}`;
      if (sort) url += `&sort=${sort}`;
      
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Get single product
export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.product = null;
      state.error = null;
    },
    clearProductErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.page = action.payload.pagination.page;
        state.pages = action.payload.pagination.pages;
        state.totalProducts = action.payload.total;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get product details
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetails, clearProductErrors } = productSlice.actions;
export default productSlice.reducer;
