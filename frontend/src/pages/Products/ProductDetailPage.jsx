import { useState } from 'react';
import { useParams } from 'react-router-dom';

// Sample product data - will be replaced with API call
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Tower Fan',
    price: 129.99,
    description: 'A powerful and elegant tower fan with multiple speed settings and oscillation features.',
    image: 'https://placehold.co/300x400',
    colors: ['#000000', '#FFFFFF', '#808080'],
    sizes: ['Small', 'Medium', 'Large']
  },
  {
    id: 2,
    name: 'Smart Air Conditioner',
    price: 499.99,
    description: 'Smart AC unit with WiFi connectivity and energy-saving features.',
    image: 'https://placehold.co/300x400',
    colors: ['#FFFFFF', '#C0C0C0'],
    sizes: ['1.0 Ton', '1.5 Ton', '2.0 Ton']
  }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = SAMPLE_PRODUCTS.find(p => p.id === parseInt(id));

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', {
      product,
      color: selectedColor,
      size: selectedSize,
      quantity
    });
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product Image */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-gray-500">{product.description}</p>
          </div>

          <div className="mt-10">
            <h2 className="text-sm font-medium text-gray-900">Color</h2>
            <div className="mt-4 flex items-center space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`relative h-8 w-8 rounded-full border ${selectedColor === color ? 'ring-2 ring-indigo-500' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-sm font-medium text-gray-900">Size</h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`border rounded-md py-3 px-3 text-sm font-medium ${selectedSize === size ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900">Quantity</h2>
              <div className="flex items-center">
                <button
                  className="rounded-l border border-gray-300 px-3 py-1"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="border-t border-b border-gray-300 px-4 py-1">{quantity}</span>
                <button
                  className="rounded-r border border-gray-300 px-3 py-1"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-medium text-gray-900">${product.price}</p>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;