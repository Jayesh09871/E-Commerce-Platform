import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState('');

  // Mock data - will be replaced with API calls
  useEffect(() => {
    // Mock orders
    const mockOrders = [
      {
        id: 1,
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          address: '123 Main St, City, Country'
        },
        products: [
          {
            name: 'Premium Tower Fan',
            quantity: 1,
            color: '#000000',
            size: 'Medium',
            price: 129.99
          }
        ],
        status: 'Paid',
        total: 129.99,
        createdAt: '2024-02-20T10:00:00Z'
      },
      {
        id: 2,
        customer: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          address: '456 Oak Ave, City, Country'
        },
        products: [
          {
            name: 'Smart Air Conditioner',
            quantity: 1,
            color: '#FFFFFF',
            size: '1.5 Ton',
            price: 499.99
          }
        ],
        status: 'Paid',
        total: 499.99,
        createdAt: '2024-02-20T11:30:00Z'
      }
    ];

    // Mock riders
    const mockRiders = [
      {
        id: 1,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1234567890',
        status: 'Available'
      },
      {
        id: 2,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+1987654321',
        status: 'On Delivery'
      }
    ];

    setOrders(mockOrders);
    setRiders(mockRiders);
  }, []);

  const handleAssignRider = (orderId) => {
    if (!selectedRider) return;

    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: 'Shipped', assignedRider: selectedRider }
          : order
      )
    );

    setSelectedRider('');
    // TODO: Update order status and rider assignment in backend
  };

  // Admin role check - will be replaced with proper role-based authentication
  const isAdmin = user?.email === 'admin@example.com';

  if (!user || !isAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Orders Management */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Orders Management</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{order.id}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {/* Customer Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Customer</h4>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>{order.customer.name}</p>
                    <p>{order.customer.email}</p>
                    <p>{order.customer.address}</p>
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Products</h4>
                  <div className="mt-2 space-y-2">
                    {order.products.map((product, index) => (
                      <div key={index} className="text-sm text-gray-500">
                        <p>
                          {product.quantity}x {product.name}
                        </p>
                        <p className="flex items-center">
                          <span
                            className="h-3 w-3 rounded-full border mr-2"
                            style={{ backgroundColor: product.color }}
                          />
                          {product.size}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Rider Assignment */}
              {order.status === 'Paid' && (
                <div className="mt-6 flex items-center space-x-4">
                  <select
                    value={selectedRider}
                    onChange={(e) => setSelectedRider(e.target.value)}
                    className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Rider</option>
                    {riders
                      .filter((rider) => rider.status === 'Available')
                      .map((rider) => (
                        <option key={rider.id} value={rider.id}>
                          {rider.name}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => handleAssignRider(order.id)}
                    disabled={!selectedRider}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Assign Rider
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Riders Management */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Riders Management</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {riders.map((rider) => (
            <div key={rider.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{rider.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{rider.email}</p>
                  <p className="text-sm text-gray-500">{rider.phone}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rider.status === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {rider.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;