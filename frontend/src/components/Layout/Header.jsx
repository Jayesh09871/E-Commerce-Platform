import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              CoolBreeze
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              to="/"
              className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Products
            </Link>
          </div>

          <div className="flex items-center">
            <Link
              to="/cart"
              className="p-2 rounded-full text-gray-400 hover:text-gray-500"
            >
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
            
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <UserIcon className="h-6 w-6" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;