import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../store/slices/orderSlice';
import { getAllRiders } from '../store/slices/riderSlice';
import { FaShoppingCart, FaMotorcycle, FaMoneyBillWave, FaBoxOpen } from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { riders } = useSelector((state) => state.riders);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalRiders: 0
  });

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getAllRiders());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const paidOrders = orders.filter(order => order.status === 'paid').length;
      const shippedOrders = orders.filter(order => order.status === 'shipped').length;
      const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
      
      // Calculate total revenue from paid orders
      const totalRevenue = orders
        .filter(order => order.isPaid)
        .reduce((acc, order) => acc + order.totalPrice, 0);
      
      setStats({
        totalOrders: orders.length,
        pendingOrders,
        paidOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue,
        totalRiders: riders.length
      });
    }
  }, [orders, riders]);

  // Get recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <FaShoppingCart className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalOrders}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all orders →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaMoneyBillWave className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-800">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-green-600 text-sm font-medium">
              From {orders.filter(order => order.isPaid).length} paid orders
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaBoxOpen className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Paid Orders</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.paidOrders}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-blue-600 text-sm font-medium">
              Ready to be shipped
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaMotorcycle className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 font-medium">Total Riders</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalRiders}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/riders" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View all riders →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Order Status Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-semibold">{stats.pendingOrders}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-500">Paid</p>
            <p className="text-xl font-semibold">{stats.paidOrders}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-500">Shipped</p>
            <p className="text-xl font-semibold">{stats.shippedOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-500">Delivered</p>
            <p className="text-xl font-semibold">{stats.deliveredOrders}</p>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order._id.substring(order._id.length - 6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'pending'
                          ? 'bg-gray-100 text-gray-800'
                          : order.status === 'paid'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'shipped'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₹{order.totalPrice.toFixed(2)}
                  </div>
                  <div>
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No orders found
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Link
            to="/orders"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all orders →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
