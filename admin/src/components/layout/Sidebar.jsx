import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaShoppingCart, 
  FaMotorcycle, 
  FaTimes 
} from 'react-icons/fa';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: FaTachometerAlt },
    { name: 'Orders', href: '/orders', icon: FaShoppingCart },
    { name: 'Riders', href: '/riders', icon: FaMotorcycle },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white shadow-xl">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-primary-600">Fan & AC Admin</h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      location.pathname === item.href
                        ? 'text-primary-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-6 w-6`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white shadow-lg">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-primary-600">Fan & AC Admin</h1>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'bg-primary-100 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        location.pathname === item.href
                          ? 'text-primary-600'
                          : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 h-6 w-6`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
