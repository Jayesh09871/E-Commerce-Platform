import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  clearProductDetails,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { toast } from "react-toastify";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaShoppingCart,
  FaArrowLeft,
} from "react-icons/fa";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    dispatch(getProductDetails(id));

    // Cleanup on unmount
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }

    // Set default selections if product has variants
    if (product && product.variants && product.variants.length > 0) {
      setSelectedColor(product.variants[0].color);
      setSelectedSize(product.variants[0].size);
    }
  }, [product]);

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);

    // Find a variant with this color to set an appropriate size
    const variantWithColor = product.variants.find(
      (v) => v.color.name === color.name
    );
    if (variantWithColor) {
      setSelectedSize(variantWithColor.size);

      // If variant has specific images, update main image
      if (variantWithColor.images && variantWithColor.images.length > 0) {
        setMainImage(variantWithColor.images[0]);
      }
    }
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  // Handle image click
  const handleImageClick = (image) => {
    setMainImage(image);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select color and size");
      return;
    }

    // Find the specific variant
    const variant = product.variants.find(
      (v) => v.color.name === selectedColor.name && v.size === selectedSize
    );

    // Check if variant exists and has stock
    if (!variant) {
      toast.error("Selected combination is not available");
      return;
    }

    if (variant.stock < quantity) {
      toast.error(`Sorry, only ${variant.stock} items in stock`);
      return;
    }

    // Add to cart
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image:
          variant.images && variant.images.length > 0
            ? variant.images[0]
            : product.images[0],
        price: variant.price || product.price,
        color: selectedColor,
        size: selectedSize,
        quantity,
      })
    );

    toast.success("Added to cart");
  };

  // Get unique colors from variants
  const getUniqueColors = () => {
    if (!product || !product.variants) return [];

    const uniqueColors = [];
    const colorNames = new Set();

    product.variants.forEach((variant) => {
      if (!colorNames.has(variant.color.name)) {
        colorNames.add(variant.color.name);
        uniqueColors.push(variant.color);
      }
    });

    return uniqueColors;
  };

  // Get available sizes for selected color
  const getAvailableSizes = () => {
    if (!product || !product.variants || !selectedColor) return [];

    return product.variants
      .filter((variant) => variant.color.name === selectedColor.name)
      .map((variant) => variant.size);
  };

  // Render rating stars
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <Link
            to="/products"
            className="mt-4 inline-block bg-primary-600 text-gray-800 px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-800 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            className="mt-4 inline-block bg-primary-600 text-gray-800 px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/products"
          className="text-primary-600 hover:text-primary-800 flex items-center"
        >
          <FaArrowLeft className="mr-1" /> Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="bg-white rounded-lg overflow-hidden mb-4 border border-gray-200">
            <img
              src={mainImage || product.images[0]}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer border rounded-md overflow-hidden ${
                  mainImage === image ? "border-primary-600" : "border-gray-200"
                }`}
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  className="w-full h-16 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderRatingStars(product.averageRating)}
            </div>
            <span className="text-gray-600">
              ({product.numReviews}{" "}
              {product.numReviews === 1 ? "review" : "reviews"})
            </span>
          </div>

          <div className="mb-4">
            <span className="text-gray-600">Brand: </span>
            <span className="font-medium">{product.brand}</span>
          </div>

          {product.discount > 0 ? (
            <div className="mb-6">
              <span className="text-2xl font-bold text-primary-600 mr-2">
                $
                {(
                  product.price -
                  (product.price * product.discount) / 100
                ).toFixed(2)}
              </span>
              <span className="text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
              <span className="ml-2 bg-red-500 text-gray-800 px-2 py-1 text-xs font-semibold rounded">
                {product.discount}% OFF
              </span>
            </div>
          ) : (
            <div className="text-2xl font-bold text-primary-600 mb-6">
              ${product.price.toFixed(2)}
            </div>
          )}

          {/* Color Selection */}
          {getUniqueColors().length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {getUniqueColors().map((color, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor && selectedColor.name === color.name
                        ? "border-primary-600"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.code }}
                    onClick={() => handleColorSelect(color)}
                    title={color.name}
                  ></button>
                ))}
              </div>
              {selectedColor && (
                <p className="mt-1 text-sm text-gray-600">
                  {selectedColor.name}
                </p>
              )}
            </div>
          )}

          {/* Size Selection */}
          {getAvailableSizes().length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {getAvailableSizes().map((size, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border ${
                      selectedSize === size
                        ? "border-primary-600 bg-primary-50 text-primary-600"
                        : "border-gray-300 text-gray-700 hover:border-primary-300"
                    } rounded-md`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Quantity</h3>
            <select
              value={quantity}
              onChange={handleQuantityChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {[...Array(10).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-md flex items-center justify-center font-bold text-black transition-all duration-300 shadow-lg
    ${
      product.stock === 0
        ? "bg-gray-400 text-white cursor-not-allowed"
        : "bg-yellow-300 hover:bg-yellow-400 hover:shadow-yellow-500/50"
    }
  `}
            disabled={product.stock === 0}
          >
            <FaShoppingCart className="mr-2 text-lg" />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>

          {/* Product Description */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <dl className="divide-y divide-gray-200">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <dt className="text-sm font-medium text-gray-500">
                        {spec.name}
                      </dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
