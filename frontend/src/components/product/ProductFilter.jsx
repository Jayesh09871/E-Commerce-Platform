import React, { useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

const ProductFilter = ({ onFilter, initialFilters }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(
    initialFilters || {
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      featured: false,
      sort: "newest",
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      featured: false,
      sort: "newest",
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="relative">
      {/* Mobile Filter Toggle Button */}
      <button
        className="md:hidden flex items-center bg-primary-600 text-gray-800 px-4 py-2 rounded-md mb-4"
        onClick={toggleFilter}
      >
        {isFilterOpen ? (
          <>
            <FaTimes className="mr-2" /> Close Filters
          </>
        ) : (
          <>
            <FaFilter className="mr-2" /> Show Filters
          </>
        )}
      </button>

      {/* Filter Form */}
      <div
        className={`bg-white rounded-lg shadow-md p-4 mb-6 ${
          isFilterOpen ? "block" : "hidden md:block"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={handleReset}
            className="text-primary-600 hover:text-primary-800 text-sm"
          >
            Reset All
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              <option value="fan">Fans</option>
              <option value="air-conditioner">Air Conditioners</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Brand</label>
            <select
              name="brand"
              value={filters.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Brands</option>
              <option value="Dyson">Dyson</option>
              <option value="Honeywell">Honeywell</option>
              <option value="Daikin">Daikin</option>
              <option value="Mitsubishi">Mitsubishi</option>
              <option value="LG">LG</option>
              <option value="Samsung">Samsung</option>
              <option value="Panasonic">Panasonic</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Featured Products */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={filters.featured}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Featured Products Only</span>
            </label>
          </div>

          {/* Sort By */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Sort By</label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-md hover:opacity-90 transition duration-300"
          >
            Apply Filters
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFilter;
