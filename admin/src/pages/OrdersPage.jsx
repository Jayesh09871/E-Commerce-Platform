import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../store/slices/orderSlice';
import { FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);
  
  useEffect(() => {
    if (orders.length > 0) {
      let filtered = [...orders];
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === statusFilter);
      }
      
      // Apply search filter
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          order => 
            order._id.toLowerCase().includes(term) ||
            (order.user?.name && order.user.name.toLowerCase().includes(term)) ||
            (order.user?.email && order.user.email.toLowerCase().includes(term)) ||
            (order.shippingAddress?.address && order.shippingAddress.address.toLowerCase().includes(term))
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        if (sortConfig.key === 'createdAt') {
          return sortConfig.direction === 'asc'
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortConfig.key === 'totalPrice') {
          return sortConfig.direction === 'asc'
            ? a.totalPrice - b.totalPrice
            : b.totalPrice - a.totalPrice;
        }
        return 0;
      });
      
      setFilteredOrders(filtered);
    }
  }, [orders, searchTerm, statusFilter, sortConfig]);
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 text-gray-400" />;
    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="ml-1 text-gray-800" />
    ) : (
      <FaSortDown className="ml-1 text-gray-800" />
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-shrink-0">
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading orders...</div>
        ) : filteredOrders.length > 0 ? (
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
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('totalPrice')}
                  >
                    <div className="flex items-center">
                      Total {getSortIcon('totalPrice')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
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
          <div className="p-6 text-center text-gray-500">
            No orders found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
