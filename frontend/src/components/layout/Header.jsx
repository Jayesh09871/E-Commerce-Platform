import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { HiOutlineShoppingCart } from "react-icons/hi";

import { HiOutlineUserCircle } from "react-icons/hi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary-600 text-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl text-gray-800 font-bold">
            Fan & AC Shop
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 focus:outline-none bg-primary-700 px-3 py-2 rounded-md"
            onClick={toggleMenu}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-800 hover:text-primary-600 transition duration-300 font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-800 hover:text-primary-600 ml-4 transition duration-300 font-medium"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="text-gray-800  hover:bg-primary-600 transition duration-300 relative px-4 py-2 bg-primary-700 rounded-md font-medium flex items-center gap-2"
            >
              <HiOutlineShoppingCart className="text-xl" />
              Cart
              {items.length > 0 && (
                <span className="ml-[1px] bg-red-500 text-white text-xs rounded-full px-2 py-1 inline-flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-800 hover:text-primary-200 transition duration-300 bg-primary-700 px-2 py-2 rounded-md font-medium">
                  <HiOutlineUserCircle className="text-xl" />
                  {user?.name?.split(" ")[0]}
                </button>

                <div className="absolute right-2  mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-primary-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-primary-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-800 hover:text-primary-200 transition duration-300 bg-primary-700 px-4 py-2 rounded-md font-medium"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col space-y-2 bg-primary-700 p-4 rounded-md">
            <Link
              to="/"
              className="text-gray-800 hover:text-primary-200 transition duration-300 py-2 px-3 rounded-md font-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-800 hover:text-primary-200 transition duration-300 py-2 px-3 rounded-md font-medium"
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="text-gray-800 hover:text-primary-200 transition duration-300 flex items-center justify-between py-2 px-3 rounded-md font-medium bg-primary-800"
              onClick={toggleMenu}
            >
              <span>Cart</span>
              {items.length > 0 && (
                <span className="bg-red-500 text-gray-800 text-xs rounded-full px-2 py-1 inline-flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-800 hover:text-primary-200 transition duration-300 py-2 px-3 rounded-md font-medium"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logoutHandler();
                    toggleMenu();
                  }}
                  className="text-gray-800 hover:text-primary-200 transition duration-300 text-left py-2 px-3 rounded-md font-medium bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-800 hover:text-primary-200 transition duration-300 py-2 px-3 rounded-md font-medium bg-primary-800"
                onClick={toggleMenu}
              >
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
