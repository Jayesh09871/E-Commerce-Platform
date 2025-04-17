import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { FaBars, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none md:hidden"
            >
              <FaBars className="h-6 w-6" />
            </button>
            <div className="ml-4 md:ml-0">
              <h1 className="text-xl font-bold text-primary-600">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative group">
              <button className="flex items-center text-gray-700 focus:outline-none">
                <span className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  <FaUser />
                </span>
                <span className="ml-2 font-medium hidden md:block">
                  {user?.name || 'Admin'}
                </span>
                <svg
                  className="ml-1 h-5 w-5 text-gray-400 hidden md:block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mr-20"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <FaSignOutAlt className="mr-2" />
                    Sign out
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
