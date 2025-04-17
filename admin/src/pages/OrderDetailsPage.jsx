import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetails, updateOrderStatus, resetOrderSuccess } from '../store/slices/orderSlice';
import { getAllRiders } from '../store/slices/riderSlice';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCheck, FaTruck, FaMotorcycle } from 'react-icons/fa';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { order, loading, error, success } = useSelector((state) => state.orders);
  const { riders } = useSelector((state) => state.riders);
  
  const [selectedRider, setSelectedRider] = useState('');
  const [showRiderModal, setShowRiderModal] = useState(false);
  
  useEffect(() => {
    dispatch(getOrderDetails(id));
    dispatch(getAllRiders());
    
    // Cleanup
    return () => {
      dispatch(resetOrderSuccess());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    
    if (success) {
      toast.success('Order status updated successfully');
      setShowRiderModal(false);
    }
  }, [error, success]);
  
  const handleStatusChange = (status) => {
    if (status === 'shipped') {
      // Show rider selection modal
      setShowRiderModal(true);
    } else {
      dispatch(updateOrderStatus({ id, status }));
    }
  };
  
  const handleShipOrder = () => {
    if (!selectedRider) {
      toast.error('Please select a rider');
      return;
    }
    
    dispatch(updateOrderStatus({ id, status: 'shipped', riderId: selectedRider }));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">Order not found</div>
        <div className="mt-4 text-center">
          <Link to="/orders" className="text-primary-600 hover:text-primary-700">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/orders" className="text-primary-600 hover:text-primary-700 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">
          Order #{order._id.substring(order._id.length - 6)}
        </h1>
      </div>
      
      {/* Order Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Order Status</h2>
            <div className="mt-2 flex items-center">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  order.status === 'pending'
                    ? 'bg-gray-100 text-gray-800'
                    : order.status === 'paid'
                    ? 'bg-blue-100 text-blue-800'
                    : order.status === 'shipped'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className="ml-4 text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {order.status === 'paid' && (
              <button
                onClick={() => handleStatusChange('shipped')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FaTruck className="mr-2" /> Mark as Shipped
              </button>
            )}
            
            {order.status === 'shipped' && (
              <button
                onClick={() => handleStatusChange('delivered')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaCheck className="mr-2" /> Mark as Delivered
              </button>
            )}
          </div>
        </div>
        
        {/* Assigned Rider (if shipped) */}
        {order.status === 'shipped' && order.rider && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 flex items-center">
              <FaMotorcycle className="mr-2" /> Assigned Rider
            </h3>
            <div className="mt-2 flex items-center">
              <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600">
                {order.rider.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{order.rider.name}</p>
                <p className="text-sm text-gray-500">{order.rider.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Order Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{order.user?.email || 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Status:</span>{' '}
                  {order.isPaid ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-red-600">Not Paid</span>
                  )}
                </p>
                {order.isPaid && (
                  <p className="text-sm text-gray-500">
                    Paid on: {new Date(order.paidAt).toLocaleString()}
                  </p>
                )}
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Method:</span>{' '}
                  {order.paymentMethod}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
              <div className="mt-2">
                {order.shippingAddress ? (
                  <>
                    <p className="text-sm text-gray-900">{order.shippingAddress.address}</p>
                    <p className="text-sm text-gray-500">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-500">{order.shippingAddress.country}</p>
                    <p className="text-sm text-gray-500">Phone: {order.shippingAddress.phone}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No shipping address provided</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order Summary</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Items:</span> ₹{order.itemsPrice?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Shipping:</span> ₹{order.shippingPrice?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Tax:</span> ₹{order.taxPrice?.toFixed(2) || '0.00'}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-medium">Total:</span> ₹{order.totalPrice?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Items */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((item) => (
              <div key={item._id} className="px-6 py-4 flex items-center">
                <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-center object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                  {item.color && (
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                  )}
                  {item.size && (
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {item.qty} x ₹{item.price.toFixed(2)}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{(item.qty * item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No items in this order
            </div>
          )}
        </div>
      </div>
      
      {/* Rider Selection Modal */}
      {showRiderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaMotorcycle className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Assign Rider
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Select a rider to deliver this order
                      </p>
                    </div>
                    <div className="mt-4">
                      <select
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={selectedRider}
                        onChange={(e) => setSelectedRider(e.target.value)}
                      >
                        <option value="">Select a rider</option>
                        {riders.map((rider) => (
                          <option key={rider._id} value={rider._id}>
                            {rider.name} ({rider.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleShipOrder}
                >
                  Assign & Ship
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRiderModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
