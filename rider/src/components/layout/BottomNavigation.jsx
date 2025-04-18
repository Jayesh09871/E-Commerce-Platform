import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaMotorcycle } from 'react-icons/fa';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    {
      to: '/',
      icon: FaHome,
      label: 'Orders',
      exact: true
    },
    {
      to: '/profile',
      icon: FaUser,
      label: 'Profile'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`
            }
          >
            <item.icon className="text-xl mb-1" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
      {/* Safe area padding for iOS devices */}
      <div className="h-safe-bottom bg-white"></div>
    </nav>
  );
};

export default BottomNavigation;
