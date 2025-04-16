import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, color, size, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item =>
          item.productId === product.id &&
          item.color === color &&
          item.size === size
      );

      if (existingItem) {
        return prevItems.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          color,
          size,
          quantity
        }
      ];
    });
  };

  const removeFromCart = (productId, color, size) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item =>
          !(item.productId === productId &&
            item.color === color &&
            item.size === size)
      )
    );
  };

  const updateQuantity = (productId, color, size, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, color, size);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId &&
        item.color === color &&
        item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};