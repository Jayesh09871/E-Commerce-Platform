import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: localStorage.getItem('paymentMethod') || 'credit_card',
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.items.find(
        (x) => 
          x.product === item.product && 
          x.color.name === item.color.name && 
          x.size === item.size
      );

      if (existItem) {
        state.items = state.items.map((x) =>
          x.product === existItem.product && 
          x.color.name === existItem.color.name && 
          x.size === existItem.size
            ? item
            : x
        );
      } else {
        state.items = [...state.items, item];
      }

      // Calculate prices
      state.itemsPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      
      // Tax price (10% of items price)
      state.taxPrice = Number((0.1 * state.itemsPrice).toFixed(2));
      
      // Shipping price (free shipping for orders over $100)
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      
      // Total price
      state.totalPrice = (
        state.itemsPrice +
        state.taxPrice +
        state.shippingPrice
      ).toFixed(2);

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const { productId, color, size } = action.payload;
      state.items = state.items.filter(
        (x) => 
          !(x.product === productId && 
          x.color.name === color.name && 
          x.size === size)
      );

      // Calculate prices
      state.itemsPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      
      // Tax price (10% of items price)
      state.taxPrice = Number((0.1 * state.itemsPrice).toFixed(2));
      
      // Shipping price (free shipping for orders over $100)
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      
      // Total price
      state.totalPrice = (
        state.itemsPrice +
        state.taxPrice +
        state.shippingPrice
      ).toFixed(2);

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.itemsPrice = 0;
      state.taxPrice = 0;
      state.shippingPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cartItems');
    },
    calculatePrices: (state) => {
      // Calculate items price
      state.itemsPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      
      // Tax price (10% of items price)
      state.taxPrice = Number((0.1 * state.itemsPrice).toFixed(2));
      
      // Shipping price (free shipping for orders over $100)
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      
      // Total price
      state.totalPrice = (
        state.itemsPrice +
        state.taxPrice +
        state.shippingPrice
      ).toFixed(2);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
  calculatePrices,
} = cartSlice.actions;

export default cartSlice.reducer;
