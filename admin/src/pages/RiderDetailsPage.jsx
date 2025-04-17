import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getRiderDetails, getRiderOrders } from '../store/slices/riderSlice';
import { FaArrowLeft, FaMotorcycle, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const RiderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { rider, loading } = useSelector((state) => state.riders);
  
  useEffect(() => {
    dispatch(getRiderDetails(id));
    dispatch(getRiderOrders(id));
  }, [dispatch, id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading rider details...</div>
      </div>
    );
  }
  
  if (!rider) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">Rider not found</div>
        <div className="mt-4 text-center">
          <Link to="/riders" className="text-primary-600 hover:text-primary-700">
            ← Back to Riders
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/riders" className="text-primary-600 hover:text-primary-700 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Rider Details</h1>
      </div>
      
      {/* Rider Profile */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-full bg-primary-100 text-primary-600 mb-4 md:mb-0">
            <FaMotorcycle className="h-12 w-12" />
          </div>
          
          <div className="md:ml-6 flex-1">
            <h2 className="text-xl font-medium text-gray-900">{rider.name}</h2>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaEnvelope className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">{rider.email}</span>
              </div>
              
              {rider.phone && (
                <div className="flex items-center">
                  <FaPhone className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{rider.phone}</span>
                </div>
              )}
              
              {rider.address && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{rider.address}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </div>
              <div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                {rider.assignedOrders?.length || 0} Assigned Orders
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Assigned Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Assigned Orders</h2>
        </div>
        
        {rider.orders && rider.orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rider.orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.substring(order._id.length - 6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            No orders assigned to this rider
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDetailsPage;
