import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearCart, savePaymentMethod, saveShippingAddress } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress, paymentMethod, items, totalPrice } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Shipping form state
  const [street, setStreet] = useState(shippingAddress.street || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [state, setState] = useState(shippingAddress.state || '');
  const [zipCode, setZipCode] = useState(shippingAddress.zipCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethod || 'credit_card'
  );

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const submitShippingForm = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        street,
        city,
        state,
        zipCode,
        country,
      })
    );
    setActiveStep(2);
  };

  const submitPaymentMethod = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(selectedPaymentMethod));
    setActiveStep(3);
  };

  const placeOrder = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const orderData = {
        items: items.map((item) => ({
          product: item.product,
          name: item.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        shippingAddress: {
          street,
          city,
          state,
          zipCode,
          country,
        },
        paymentMethod: selectedPaymentMethod,
        taxPrice: Number((0.1 * items.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2)),
        shippingPrice: items.reduce((acc, item) => acc + item.price * item.quantity, 0) > 100 ? 0 : 10,
        totalPrice: Number(totalPrice),
      };

      const { data } = await axios.post('/api/orders', orderData, config);

      // Clear cart after successful order
      dispatch(clearCart());
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Navigate to order confirmation
      navigate(`/profile?orderId=${data.data._id}`);
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Checkout Steps */}
      <div className="flex mb-8">
        <div
          className={`flex-1 text-center pb-2 ${
            activeStep >= 1 ? 'border-b-2 border-primary-600 text-primary-600' : 'border-b text-gray-500'
          }`}
        >
          <span className="font-semibold">1. Shipping</span>
        </div>
        <div
          className={`flex-1 text-center pb-2 ${
            activeStep >= 2 ? 'border-b-2 border-primary-600 text-primary-600' : 'border-b text-gray-500'
          }`}
        >
          <span className="font-semibold">2. Payment</span>
        </div>
        <div
          className={`flex-1 text-center pb-2 ${
            activeStep >= 3 ? 'border-b-2 border-primary-600 text-primary-600' : 'border-b text-gray-500'
          }`}
        >
          <span className="font-semibold">3. Place Order</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Shipping Form */}
            {activeStep === 1 && (
              <>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-primary-600" /> Shipping Address
                </h2>
                <form onSubmit={submitShippingForm}>
                  <div className="mb-4">
                    <label htmlFor="street" className="block text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="city" className="block text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter your city"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="state" className="block text-gray-700 mb-2">
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter your state"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="zipCode" className="block text-gray-700 mb-2">
                        Zip / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter your zip code"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="country" className="block text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Enter your country"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => navigate('/cart')}
                      className="flex items-center text-primary-600 hover:text-primary-800"
                    >
                      <FaArrowLeft className="mr-1" /> Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-600 text-gray-800 px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-300"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Payment Method */}
            {activeStep === 2 && (
              <>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaCreditCard className="mr-2 text-primary-600" /> Payment Method
                </h2>
                <form onSubmit={submitPaymentMethod}>
                  <div className="mb-6">
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={selectedPaymentMethod === 'credit_card'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Credit Card</span>
                      </label>
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="debit_card"
                          checked={selectedPaymentMethod === 'debit_card'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Debit Card</span>
                      </label>
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={selectedPaymentMethod === 'paypal'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">PayPal</span>
                      </label>
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash_on_delivery"
                          checked={selectedPaymentMethod === 'cash_on_delivery'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Cash on Delivery</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="flex items-center text-primary-600 hover:text-primary-800"
                    >
                      <FaArrowLeft className="mr-1" /> Back to Shipping
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-600 text-gray-800 px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-300"
                    >
                      Continue to Review
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Order Review */}
            {activeStep === 3 && (
              <>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaCheckCircle className="mr-2 text-primary-600" /> Review Your Order
                </h2>

                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700">
                      {user.name}
                      <br />
                      {street}
                      <br />
                      {city}, {state} {zipCode}
                      <br />
                      {country}
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700">
                      {selectedPaymentMethod === 'credit_card' && 'Credit Card'}
                      {selectedPaymentMethod === 'debit_card' && 'Debit Card'}
                      {selectedPaymentMethod === 'paypal' && 'PayPal'}
                      {selectedPaymentMethod === 'cash_on_delivery' && 'Cash on Delivery'}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Order Items</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {items.map((item, index) => (
                      <div
                        key={`${item.product}-${item.color.name}-${item.size}-${index}`}
                        className={`flex items-center py-3 ${
                          index !== items.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="flex items-center mt-1">
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300 mr-1"
                              style={{ backgroundColor: item.color.code }}
                            ></div>
                            <span className="text-gray-600 text-sm">{item.color.name}</span>
                            {item.size && (
                              <span className="text-gray-600 text-sm ml-2">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-gray-600 text-sm">
                            {item.quantity} x ${item.price.toFixed(2)} = $
                            {(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="flex items-center text-primary-600 hover:text-primary-800"
                  >
                    <FaArrowLeft className="mr-1" /> Back to Payment
                  </button>
                  <button
                    type="button"
                    onClick={placeOrder}
                    className="bg-primary-600 text-gray-800 px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-300 flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : null}
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({items.length}):</span>
                <span className="font-medium">
                  ${items
                    .reduce((acc, item) => acc + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">
                  ${(
                    0.1 *
                    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  ${items.reduce((acc, item) => acc + item.price * item.quantity, 0) > 100
                    ? '0.00'
                    : '10.00'}
                </span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
