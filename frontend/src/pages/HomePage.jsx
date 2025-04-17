import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { FaFan, FaSnowflake, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    // Fetch featured products for the homepage
    dispatch(getProducts({ featured: true, limit: 8 }));
  }, [dispatch]);

  const heroImage = 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80';

  return (
    <div>
      {/* Hero Section */}
      <section
        className="bg-cover bg-center h-96 flex items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-lg bg-white/80 backdrop-blur-sm p-8 rounded-lg">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Stay Cool & Comfortable
            </h1>
            <p className="text-gray-700 mb-6">
              Discover our premium collection of fans and air conditioners for your home and office.
              Quality products with stylish designs to match any decor.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/products?category=fan"
                className="bg-primary-600 text-gray-800 px-6 py-3 rounded-md hover:bg-primary-700 transition-colors duration-300 flex items-center"
              >
                <FaFan className="mr-2" /> Shop Fans
              </Link>
              <Link
                to="/products?category=air-conditioner"
                className="bg-secondary-600 text-gray-800 px-6 py-3 rounded-md hover:bg-secondary-700 transition-colors duration-300 flex items-center"
              >
                <FaSnowflake className="mr-2" /> Shop ACs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-800 flex items-center"
            >
              View All <FaArrowRight className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fans Category */}
            <div className="relative overflow-hidden rounded-lg group">
              <img
                src="https://images.unsplash.com/photo-1614632536449-12c9f02d0238?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Fans"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Fans</h3>
                  <p className="text-white mb-4">
                    Ceiling, Table, Pedestal, and Wall Fans
                  </p>
                  <Link
                    to="/products?category=fan"
                    className="inline-block bg-white text-primary-600 px-6 py-2 rounded-md hover:bg-primary-50 transition-colors duration-300"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Air Conditioners Category */}
            <div className="relative overflow-hidden rounded-lg group">
              <img
                src="https://images.unsplash.com/photo-1581275288578-bfb98a6fa4a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                alt="Air Conditioners"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Air Conditioners
                  </h3>
                  <p className="text-white mb-4">
                    Split, Window, and Portable ACs
                  </p>
                  <Link
                    to="/products?category=air-conditioner"
                    className="inline-block bg-white text-primary-600 px-6 py-2 rounded-md hover:bg-primary-50 transition-colors duration-300"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">
                We offer only the highest quality fans and air conditioners from
                trusted brands.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Competitive Prices</h3>
              <p className="text-gray-600">
                Get the best value for your money with our competitive pricing
                and regular discounts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellent Support</h3>
              <p className="text-gray-600">
                Our customer service team is always ready to assist you with any
                questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
