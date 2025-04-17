import React, { useEffect } from 'react';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { calculatePrices } from '../store/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    // Calculate prices whenever cart items change
    dispatch(calculatePrices());
  }, [dispatch, items]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <FaShoppingCart className="mr-2" /> Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-500 mb-4 text-6xl flex justify-center">
            <FaShoppingCart />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/products"
            className="bg-primary-600 text-gray-800 px-6 py-3 rounded-md hover:bg-primary-700 transition-colors duration-300 inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="hidden md:flex border-b border-gray-200 pb-4 mb-4 font-semibold text-gray-700">
                <div className="w-1/6">Product</div>
                <div className="w-3/6 px-4">Details</div>
                <div className="w-1/6 text-center">Quantity</div>
                <div className="w-1/6 text-center">Subtotal</div>
                <div className="w-1/12 text-center">Remove</div>
              </div>

              {items.map((item, index) => (
                <CartItem key={`${item.product}-${item.color.name}-${item.size}-${index}`} item={item} />
              ))}

              <div className="mt-6 flex justify-between items-center">
                <Link
                  to="/products"
                  className="text-primary-600 hover:text-primary-800 flex items-center"
                >
                  <FaArrowLeft className="mr-1" /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
