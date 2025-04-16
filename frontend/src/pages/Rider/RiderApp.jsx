import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RiderApp = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Mock rider orders data - will be replaced with API call
  useEffect(() => {
    // Simulating API call to fetch rider's assigned orders
    const mockOrders = [
      {
        id: 1,
        customer: {
          name: 'John Doe',
          address: '123 Main St, City, Country',
          phone: '+1234567890'
        },
        products: [
          {
            name: 'Premium Tower Fan',
            quantity: 1,
            color: '#000000',
            size: 'Medium'
          }
        ],
        status: 'Shipped',
        assignedAt: '2024-02-20T10:00:00Z'
      },
      {
        id: 2,
        customer: {
          name: 'Jane Smith',
          address: '456 Oak Ave, City, Country',
          phone: '+1987654321'
        },
        products: [
          {
            name: 'Smart Air Conditioner',
            quantity: 1,
            color: '#FFFFFF',
            size: '1.5 Ton'
          }
        ],
        status: 'Shipped',
        assignedAt: '2024-02-20T11:30:00Z'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // TODO: Update order status in backend
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Rider Profile */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={user.picture}
                alt={user.name}
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500">Delivery Rider</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Assigned Orders
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.id}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Assigned: {new Date(order.assignedAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Undelivered'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Customer Details */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Customer Details</h4>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{order.customer.name}</p>
                      <p>{order.customer.address}</p>
                      <p>{order.customer.phone}</p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Products</h4>
                    <div className="mt-2 space-y-2">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-500">
                          <span>{product.quantity}x</span>
                          <span className="ml-2">{product.name}</span>
                          <span
                            className="ml-2 h-3 w-3 rounded-full border"
                            style={{ backgroundColor: product.color }}
                          />
                          <span className="ml-2">{product.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.status === 'Shipped' && (
                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Mark as Delivered
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'Undelivered')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        Mark as Undelivered
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderApp;