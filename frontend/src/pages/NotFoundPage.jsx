import React from 'react';
import { FaExclamationTriangle, FaHome, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-primary-600 text-7xl mb-6 flex justify-center">
          <FaExclamationTriangle />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="bg-primary-600 text-gray-800 px-6 py-3 rounded-md hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center"
          >
            <FaHome className="mr-2" /> Go to Homepage
          </Link>
          <Link
            to="/products"
            className="bg-secondary-600 text-gray-800 px-6 py-3 rounded-md hover:bg-secondary-700 transition-colors duration-300 flex items-center justify-center"
          >
            <FaShoppingBag className="mr-2" /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
