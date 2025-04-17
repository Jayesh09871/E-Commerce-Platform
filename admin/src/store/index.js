import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import riderReducer from './slices/riderSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    riders: riderReducer,
  },
  devTools: true,
});

export default store;
