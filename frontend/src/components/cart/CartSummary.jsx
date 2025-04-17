import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CartSummary = () => {
  const { items, itemsPrice, taxPrice, shippingPrice, totalPrice } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({items.length}):</span>
          <span className="font-medium">${itemsPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax:</span>
          <span className="font-medium">${taxPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping:</span>
          <span className="font-medium">${shippingPrice.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-semibold text-primary-600">
              ${typeof totalPrice === 'string' ? totalPrice : totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-6">
          {isAuthenticated ? (
            <Link
              to="/checkout"
              className="block w-full bg-primary-600 text-gray-800 text-center py-3 rounded-md hover:bg-primary-700 transition-colors duration-300"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <Link
              to="/login?redirect=checkout"
              className="block w-full bg-primary-600 text-gray-800 text-center py-3 rounded-md hover:bg-primary-700 transition-colors duration-300"
            >
              Sign In to Checkout
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default CartSummary;
