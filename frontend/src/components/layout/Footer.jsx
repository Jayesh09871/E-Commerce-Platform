import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-bold mb-4">Fan & AC Shop</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop shop for premium quality fans and air conditioners.
              We offer a wide range of products with various colors and sizes to
              match your home or office decor.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-400">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-400">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-400">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-400">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=fan" className="text-gray-300 hover:text-white">
                  Fans
                </Link>
              </li>
              <li>
                <Link to="/products?category=air-conditioner" className="text-gray-300 hover:text-white">
                  Air Conditioners
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>123 Main Street, City</li>
              <li>Phone: +1 234 567 8900</li>
              <li>Email: info@fanacshop.com</li>
              <li>Hours: Mon-Fri 9am-5pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Fan & AC Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
