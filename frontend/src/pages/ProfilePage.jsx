import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUser, FaKey, FaShoppingBag, FaEdit, FaEye } from 'react-icons/fa';

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [profileUpdating, setProfileUpdating] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  // Check for order ID in query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('orderId');
    if (orderId) {
      setActiveTab('orders');
      fetchOrderDetails(orderId);
    }
  }, [location.search]);

  // Set initial form values when user data is available
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      
      if (user.address) {
        setStreet(user.address.street || '');
        setCity(user.address.city || '');
        setState(user.address.state || '');
        setZipCode(user.address.zipCode || '');
        setCountry(user.address.country || '');
      }
    }
  }, [user]);

  // Fetch user orders
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setOrderLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const { data } = await axios.get('/api/orders/myorders', config);
      setOrders(data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setOrderLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const { data } = await axios.get(`/api/orders/${orderId}`, config);
      setSelectedOrder(data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch order details'
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileUpdating(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const userData = {
        name,
        email,
        phone,
        address: {
          street,
          city,
          state,
          zipCode,
          country,
        },
      };

      const { data } = await axios.put('/api/users/profile', userData, config);
      
      // Update local storage with new user data
      const updatedUser = { ...user, ...data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setProfileUpdating(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordUpdating(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      await axios.put(
        '/api/users/password',
        {
          currentPassword,
          newPassword,
        },
        config
      );
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update password'
      );
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'undelivered':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-primary-600 text-gray-800 ">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white text-primary-600 flex items-center justify-center text-xl font-bold mr-4">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{user?.name}</h2>
                  <p className="text-primary-100">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaUser className="mr-2" /> Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === 'password'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaKey className="mr-2" /> Change Password
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === 'orders'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaShoppingBag className="mr-2" /> My Orders
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <form onSubmit={updateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mt-8 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-gray-700 mb-2">
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-gray-700 mb-2">
                        Zip / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
             <button
  type="submit"
  className={`px-6 py-2 rounded-md transition-colors duration-300 flex items-center
    ${profileUpdating
      ? 'bg-gray-400 text-white cursor-not-allowed'
     : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:cursor-pointer'}
  `}
  disabled={profileUpdating}
>
  {profileUpdating ? (
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
  ) : (
    <FaEdit className="mr-2" />
  )}
  Update Profile
</button>

                  </div>
                </form>
              </>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <>
                <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                <form onSubmit={updatePassword}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      className="bg-primary-600 text-gray-800 px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-300 flex items-center"
                      disabled={passwordUpdating}
                    >
                      {passwordUpdating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      ) : (
                        <FaKey className="mr-2" />
                      )}
                      Update Password
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Orders</h2>
                  {selectedOrder && (
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      Back to Orders
                    </button>
                  )}
                </div>

                {orderLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                  </div>
                ) : selectedOrder ? (
                  // Order Details View
                  <div>
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <div className="flex flex-wrap justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Order #{selectedOrder._id}</h3>
                          <p className="text-gray-600">
                            Placed on {formatDate(selectedOrder.createdAt)}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                              selectedOrder.status
                            )}`}
                          >
                            {selectedOrder.status.charAt(0).toUpperCase() +
                              selectedOrder.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <p className="text-gray-700">
                          {user.name}
                          <br />
                          {selectedOrder.shippingAddress.street}
                          <br />
                          {selectedOrder.shippingAddress.city},{' '}
                          {selectedOrder.shippingAddress.state}{' '}
                          {selectedOrder.shippingAddress.zipCode}
                          <br />
                          {selectedOrder.shippingAddress.country}
                        </p>
                      </div>
                    </div>

                    <h4 className="font-semibold mb-4">Order Items</h4>
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-4 ${
                            index !== selectedOrder.items.length - 1
                              ? 'border-b border-gray-200'
                              : ''
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium">{item.name}</h5>
                            <div className="flex items-center mt-1">
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300 mr-1"
                                style={{ backgroundColor: item.color.code }}
                              ></div>
                              <span className="text-gray-600 text-sm">
                                {item.color.name}
                              </span>
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

                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-semibold mb-4">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items:</span>
                          <span>${selectedOrder.itemsPrice?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span>${selectedOrder.shippingPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span>${selectedOrder.taxPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                          <span>Total:</span>
                          <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  // No Orders View
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4 text-6xl flex justify-center">
                      <FaShoppingBag />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't placed any orders yet.
                    </p>
                    <button
                      onClick={() => navigate('/products')}
                      className="bg-primary-600 text-gray-800  px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-300"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  // Orders List View
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Order ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order._id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${order.totalPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                  order.status
                                )}`}
                              >
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => fetchOrderDetails(order._id)}
                                className="text-primary-600 hover:text-primary-900 flex items-center"
                              >
                                <FaEye className="mr-1" /> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
