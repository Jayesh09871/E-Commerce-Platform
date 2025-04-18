import React from 'react';
import { FaMapMarkerAlt, FaUser, FaBox, FaChevronRight } from 'react-icons/fa';
import StatusBadge from './StatusBadge';

const OrderCard = ({ order = {}, onClick }) => {
  // Defensive check to ensure order is an object
  if (!order || typeof order !== 'object') {
    order = {};
  }
  
  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-gray-900">Order #{order.orderNumber || 'Unknown'}</h3>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status || 'pending'} />
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-start">
            <FaUser className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700 truncate">{order.customer?.name || 'Customer'}</p>
          </div>
          
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700 truncate">
              {order.shippingAddress?.city || 'City'}, {order.shippingAddress?.state || 'State'}
            </p>
          </div>
          
          <div className="flex items-start">
            <FaBox className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              {order.items?.length || 0} {!order.items || order.items.length === 1 ? 'item' : 'items'} · ${(order.totalAmount || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm font-medium text-primary-600">View Details</span>
        <FaChevronRight className="text-gray-400" />
      </div>
    </div>
  );
};

export default OrderCard;
