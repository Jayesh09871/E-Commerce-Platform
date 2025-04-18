import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBox, FaSpinner, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { getAssignedOrders } from '../store/slices/orderSlice';

// Components
import OrderCard from '../components/orders/OrderCard';
import EmptyState from '../components/common/EmptyState';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { orders, loading, error } = useSelector((state) => state.orders);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    dispatch(getAssignedOrders());
  }, [dispatch]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };
  
  // Ensure orders is an array before filtering
  const safeOrders = Array.isArray(orders) ? orders : [];
  
  const filteredOrders = safeOrders.filter((order) => {
    // Skip invalid orders
    if (!order || typeof order !== 'object') return false;
    
    const matchesSearch = searchTerm === '' || 
      (order.orderNumber && order.orderNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.shippingAddress?.city && order.shippingAddress.city.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === '' || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setShowFilters(false);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">My Deliveries</h1>
        
        <div className="flex items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:text-primary-600 focus:outline-none"
          >
            <FaFilter />
          </button>
          
          {(searchTerm || filterStatus) && (
            <button
              onClick={handleClearFilters}
              className="ml-2 p-2 text-red-600 hover:text-red-800 focus:outline-none"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="mb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="undelivered">Undelivered</option>
            </select>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="text-primary-600 text-3xl animate-spin mb-4" />
          <p className="text-gray-600">Loading your deliveries...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard 
              key={order._id} 
              order={order} 
              onClick={() => handleOrderClick(order._id)} 
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={FaBox}
          title="No orders found"
          description={
            searchTerm || filterStatus
              ? "No orders match your search criteria. Try adjusting your filters."
              : "You don't have any assigned deliveries yet."
          }
          actionText={searchTerm || filterStatus ? "Clear filters" : ""}
          onAction={searchTerm || filterStatus ? handleClearFilters : null}
        />
      )}
    </div>
  );
};

export default OrdersPage;
