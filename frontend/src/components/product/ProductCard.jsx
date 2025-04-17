import React from 'react';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Calculate discounted price
  const discountedPrice = product.price - (product.price * product.discount) / 100;

  // Render stars for ratings
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product._id}`}>
        <div className="h-48 overflow-hidden relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {product.discount > 0 && (
            <div className="absolute top-0 right-0 bg-red-500 text-gray-800 px-2 py-1 text-sm font-semibold">
              {product.discount}% OFF
            </div>
          )}
          {product.featured && (
            <div className="absolute top-0 left-0 bg-primary-600 text-gray-800 px-2 py-1 text-sm font-semibold">
              Featured
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600 truncate">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-center">
          {renderRatingStars(product.averageRating)}
          <span className="text-gray-600 text-sm ml-1">
            ({product.numReviews})
          </span>
        </div>

        <div className="mt-2">
          <span className="text-gray-600">{product.brand}</span>
        </div>

        <div className="mt-2 flex items-center">
          {product.discount > 0 ? (
            <>
              <span className="text-lg font-bold text-primary-600">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {product.variants.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {/* Show unique colors */}
              {Array.from(
                new Set(product.variants.map((variant) => variant.color.name))
              )
                .slice(0, 4)
                .map((colorName, index) => {
                  const variant = product.variants.find(
                    (v) => v.color.name === colorName
                  );
                  return (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: variant.color.code }}
                      title={colorName}
                    ></div>
                  );
                })}
              {product.variants.length > 4 && (
                <span className="text-xs text-gray-500">+{product.variants.length - 4} more</span>
              )}
            </div>
          )}
        </div>

        <Link
          to={`/products/${product._id}`}
          className="mt-4 block w-full text-center bg-primary-600 text-gray-800 py-2 rounded-md hover:bg-primary-700 transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
