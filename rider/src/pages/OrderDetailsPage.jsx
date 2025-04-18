import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, FaSpinner, FaMapMarkerAlt, FaPhone, 
  FaUser, FaBox, FaTruck, FaCheckCircle, FaTimesCircle 
} from 'react-icons/fa';
import { getOrderDetails, updateOrderStatus, resetOrderSuccess } from '../store/slices/orderSlice';

// Components
import StatusBadge from '../components/orders/StatusBadge';
import ConfirmationModal from '../components/common/ConfirmationModal';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { order, loading, error, success } = useSelector((state) => state.orders);
  
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const [showUndeliveredModal, setShowUndeliveredModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  
  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    
    if (success) {
      toast.success('Order status updated successfully');
      setShowDeliveredModal(false);
      setShowUndeliveredModal(false);
      setNotes('');
      setStatusLoading(false);
      dispatch(resetOrderSuccess());
    }
  }, [error, success, dispatch]);
  
  const handleUpdateStatus = (status) => {
    setStatusLoading(true);
    dispatch(updateOrderStatus({ id, status, notes }));
  };
  
  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };
  
  const handleOpenMap = (address) => {
    const formattedAddress = encodeURIComponent(
      `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
    );
    window.open(`https://maps.google.com/?q=${formattedAddress}`, '_blank');
  };
  
  // Calculate total from items
  const calculateTotal = () => {
    if (!order || !Array.isArray(order.items) || order.items.length === 0) {
      return order?.totalAmount || 0;
    }
    
    return order.items.reduce((total, item) => {
      const itemPrice = item.price || (item.product?.price || 0);
      const quantity = item.quantity || 1;
      return total + (itemPrice * quantity);
    }, 0);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FaSpinner className="text-primary-600 text-3xl animate-spin mb-4" />
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }
  
  // Handle case where order is null or undefined
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 text-red-500">
          <FaTimesCircle className="text-3xl" />
        </div>
        <p className="text-gray-800 font-medium mb-2">Order not found</p>
        <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-600 hover:text-primary-800"
        >
          <FaArrowLeft className="mr-2" /> Back to orders
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-gray-600 hover:text-primary-600 focus:outline-none"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Order #{order.orderNumber}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Status</h2>
          <StatusBadge status={order.status} />
        </div>
        
        {order.status === 'shipped' && (
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => setShowDeliveredModal(true)}
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center"
              disabled={statusLoading}
            >
              {statusLoading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaCheckCircle className="mr-2" />
              )}
              Mark as Delivered
            </button>
            
            <button
              onClick={() => setShowUndeliveredModal(true)}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center"
              disabled={statusLoading}
            >
              {statusLoading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaTimesCircle className="mr-2" />
              )}
              Mark as Undelivered
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <FaUser className="text-gray-400 mt-1 mr-3" />
            <div>
              <p className="font-medium">{order.customer?.name || 'Customer'}</p>
              <p className="text-sm text-gray-600">{order.customer?.email || 'No email provided'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FaPhone className="text-gray-400 mt-1 mr-3" />
            <div>
              <p className="font-medium">{order.customer?.phone || 'No phone provided'}</p>
              {order.customer?.phone && (
                <button
                  onClick={() => handleCall(order.customer.phone)}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Call Customer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
        <div className="flex items-start">
          <FaMapMarkerAlt className="text-gray-400 mt-1 mr-3" />
          <div>
            <p className="font-medium">{order.shippingAddress?.street || 'No street provided'}</p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress?.city || 'City'}, {order.shippingAddress?.state || 'State'} {order.shippingAddress?.zipCode || ''}
            </p>
            {order.shippingAddress && (
              <button
                onClick={() => handleOpenMap(order.shippingAddress)}
                className="text-sm text-primary-600 hover:text-primary-800 mt-1"
              >
                Open in Maps
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Order Items</h2>
        <div className="space-y-3">
          {Array.isArray(order.items) && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={item._id || index} className="flex items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-3">
                  <img
                    src={item.product?.image ? `/uploads/${item.product.image}` : 'https://cdn-icons-png.flaticon.com/512/5166/5166961.png'}
                    alt={item.product?.name || 'Product'}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://cdn-icons-png.flaticon.com/512/5166/5166961.png';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Qty: {item.quantity || 1}</p>
                    <p>${((item.price || (item.product?.price || 0)) * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 py-2">No items in this order</p>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="font-medium">Total:</span>
            <span className="font-bold">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Delivered Confirmation Modal */}
      {showDeliveredModal && (
        <ConfirmationModal
          title="Mark as Delivered"
          message="Are you sure you want to mark this order as delivered?"
          confirmText="Yes, Delivered"
          cancelText="Cancel"
          onConfirm={() => handleUpdateStatus('delivered')}
          onCancel={() => setShowDeliveredModal(false)}
          showNotes={true}
          notes={notes}
          setNotes={setNotes}
          notesPlaceholder="Add delivery notes (optional)"
        />
      )}
      
      {/* Undelivered Confirmation Modal */}
      {showUndeliveredModal && (
        <ConfirmationModal
          title="Mark as Undelivered"
          message="Are you sure you want to mark this order as undelivered?"
          confirmText="Yes, Undelivered"
          cancelText="Cancel"
          onConfirm={() => handleUpdateStatus('undelivered')}
          onCancel={() => setShowUndeliveredModal(false)}
          showNotes={true}
          notes={notes}
          setNotes={setNotes}
          notesPlaceholder="Please provide a reason (required)"
          notesRequired={true}
        />
      )}
    </div>
  );
};

export default OrderDetailsPage;
