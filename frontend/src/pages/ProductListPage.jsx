import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import { getProducts } from '../store/slices/productSlice';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, loading, error, page, pages, totalProducts } = useSelector(
    (state) => state.product
  );

  // Get initial filters from URL query params
  const getInitialFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      featured: searchParams.get('featured') === 'true',
      sort: searchParams.get('sort') || 'newest',
      page: parseInt(searchParams.get('page')) || 1,
    };
  };

  const [filters, setFilters] = useState(getInitialFilters());
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Update filters when URL changes
    setFilters(getInitialFilters());
  }, [location.search]);

  useEffect(() => {
    // Fetch products based on filters
    dispatch(getProducts(filters));
  }, [dispatch, filters]);

  const handleFilter = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
    // Update URL with new filters
    const searchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });
    window.history.pushState(
      {},
      '',
      `${location.pathname}?${searchParams.toString()}`
    );
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    // Update URL with new page
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', newPage);
    window.history.pushState(
      {},
      '',
      `${location.pathname}?${searchParams.toString()}`
    );
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {filters.category
          ? filters.category === 'fan'
            ? 'Fans'
            : 'Air Conditioners'
          : 'All Products'}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            className="flex items-center bg-primary-600 text-gray-800 px-4 py-2 rounded-md"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <FaFilter className="mr-2" />
            {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Sidebar */}
        <div
          className={`w-full md:w-1/4 ${
            isMobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <ProductFilter onFilter={handleFilter} initialFilters={filters} />
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-yellow-100 text-yellow-800 p-6 rounded-md text-center">
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p>
                Try adjusting your filters or check back later for new products.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                  Showing {products.length} of {totalProducts} products
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`mx-1 px-3 py-1 rounded-md ${
                        page === 1
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-primary-600 text-gray-800 hover:bg-primary-700'
                      }`}
                    >
                      Prev
                    </button>

                    {[...Array(pages).keys()].map((x) => (
                      <button
                        key={x + 1}
                        onClick={() => handlePageChange(x + 1)}
                        className={`mx-1 px-3 py-1 rounded-md ${
                          page === x + 1
                            ? 'bg-primary-600 text-gray-800'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {x + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pages}
                      className={`mx-1 px-3 py-1 rounded-md ${
                        page === pages
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-primary-600 text-gray-800 hover:bg-primary-700'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
