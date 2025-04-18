import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMotorcycle, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../store/slices/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };
  
  // Calculate statistics
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const pendingOrders = orders.filter(order => order.status === 'shipped').length;
  const undeliveredOrders = orders.filter(order => order.status === 'undelivered').length;
  
  const stats = [
    { label: 'Delivered', value: deliveredOrders, color: 'bg-green-100 text-green-800' },
    { label: 'Pending', value: pendingOrders, color: 'bg-blue-100 text-blue-800' },
    { label: 'Undelivered', value: undeliveredOrders, color: 'bg-red-100 text-red-800' },
  ];
  
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="bg-primary-600 p-6 text-white">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-primary-600 text-2xl font-bold mr-4">
              {user?.name ? user.name.charAt(0) : <FaUser />}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || 'Rider'}</h2>
              <p className="text-primary-100">Delivery Partner</p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <FaEnvelope className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email || 'Not available'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaPhone className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user?.phone || 'Not available'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaMotorcycle className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Vehicle Number</p>
                <p className="font-medium">{user?.vehicleNumber || 'Not available'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Delivery Statistics</h2>
        
        <div className="grid grid-cols-3 gap-2">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-lg p-3 text-center`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <button
          onClick={() => setShowConfirmation(true)}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center"
        >
          <FaSignOutAlt className="mr-2" />
          Sign Out
        </button>
      </div>
      
      {/* Logout Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-3">Sign Out</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to sign out?</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
