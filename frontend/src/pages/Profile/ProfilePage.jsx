import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Mock order data - will be replaced with API call
  const orders = [
    {
      id: 1,
      date: '2024-02-20',
      status: 'Delivered',
      total: 129.99,
      items: [
        {
          name: 'Premium Tower Fan',
          quantity: 1,
          color: '#000000',
          size: 'Medium'
        }
      ]
    },
    {
      id: 2,
      date: '2024-02-15',
      status: 'Shipped',
      total: 499.99,
      items: [
        {
          name: 'Smart Air Conditioner',
          quantity: 1,
          color: '#FFFFFF',
          size: '1.5 Ton'
        }
      ]
    }
  ];

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
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <img
              src={user.picture}
              alt={user.name}
              className="h-16 w-16 rounded-full"
            />
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Order History</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-500"
                      >
                        <span>{item.quantity}x</span>
                        <span className="ml-2">{item.name}</span>
                        <span
                          className="ml-2 h-3 w-3 rounded-full border"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="ml-2">{item.size}</span>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;