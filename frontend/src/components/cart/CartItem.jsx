import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../store/slices/cartSlice';
import { FaTrash } from 'react-icons/fa';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (e) => {
    const quantity = Number(e.target.value);
    if (quantity > 0) {
      dispatch(
        addToCart({
          ...item,
          quantity,
        })
      );
    }
  };

  const handleRemove = () => {
    dispatch(
      removeFromCart({
        productId: item.product,
        color: item.color,
        size: item.size,
      })
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center py-4 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-full md:w-1/6 mb-4 md:mb-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-md mx-auto"
        />
      </div>

      {/* Product Details */}
      <div className="w-full md:w-3/6 px-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <div className="flex items-center mt-1">
          <div
            className="w-4 h-4 rounded-full border border-gray-300 mr-2"
            style={{ backgroundColor: item.color.code }}
          ></div>
          <span className="text-gray-600 text-sm">{item.color.name}</span>
        </div>
        {item.size && (
          <div className="mt-1">
            <span className="text-gray-600 text-sm">Size: {item.size}</span>
          </div>
        )}
        <div className="mt-1">
          <span className="text-gray-600 text-sm">Price: ${item.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Quantity */}
      <div className="w-full md:w-1/6 flex justify-center items-center mt-4 md:mt-0">
        <select
          value={item.quantity}
          onChange={handleQuantityChange}
          className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {[...Array(10).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Subtotal */}
      <div className="w-full md:w-1/6 text-center mt-4 md:mt-0">
        <span className="font-semibold">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>

      {/* Remove Button */}
      <div className="w-full md:w-1/12 text-center mt-4 md:mt-0">
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 focus:outline-none"
          aria-label="Remove item"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
