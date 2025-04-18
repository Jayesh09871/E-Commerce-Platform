import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">Rider App</h1>
          </div>
          
          <div className="flex items-center">
            <div className="relative group">
              <button className="flex items-center text-gray-700 focus:outline-none">
                <span className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  {user?.name ? user.name.charAt(0) : <FaUser />}
                </span>
                <span className="ml-2 font-medium text-sm hidden md:block">
                  {user?.name || 'Rider'}
                </span>
              </button>
              <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <button
                  onClick={() => navigate('/profile')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-primary-600" />
                    My Profile
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <FaSignOutAlt className="mr-2 text-red-600" />
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
