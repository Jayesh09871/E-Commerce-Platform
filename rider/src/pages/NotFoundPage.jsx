import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 rounded-full p-4">
            <FaExclamationTriangle className="text-4xl text-yellow-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <FaHome className="mr-2" />
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
