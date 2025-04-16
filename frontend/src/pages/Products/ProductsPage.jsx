import { useState } from 'react';
import ProductCard from '../../components/Product/ProductCard';

// Sample product data - will be replaced with API call
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Tower Fan',
    price: 129.99,
    image: 'https://placehold.co/300x400',
    colors: ['#000000', '#FFFFFF', '#808080'],
    sizes: ['Small', 'Medium', 'Large']
  },
  {
    id: 2,
    name: 'Smart Air Conditioner',
    price: 499.99,
    image: 'https://placehold.co/300x400',
    colors: ['#FFFFFF', '#C0C0C0'],
    sizes: ['1.0 Ton', '1.5 Ton', '2.0 Ton']
  },
  {
    id: 3,
    name: 'Portable AC Unit',
    price: 349.99,
    image: 'https://placehold.co/300x400',
    colors: ['#000000', '#C0C0C0'],
    sizes: ['8000 BTU', '10000 BTU', '12000 BTU']
  },
  {
    id: 4,
    name: 'Desk Fan',
    price: 49.99,
    image: 'https://placehold.co/300x400',
    colors: ['#000000', '#FFFFFF', '#FF0000'],
    sizes: ['Small', 'Medium']
  },
  {
    id: 5,
    name: 'Industrial Fan',
    price: 199.99,
    image: 'https://placehold.co/300x400',
    colors: ['#000000', '#808080'],
    sizes: ['18"', '24"', '30"']
  }
];

const ProductsPage = () => {
  const [products] = useState(SAMPLE_PRODUCTS);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  const filteredProducts = products.filter(product => {
    if (selectedType !== 'all' && !product.name.toLowerCase().includes(selectedType)) {
      return false;
    }
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (product.price < min || product.price > max) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Products</h2>
        
        <div className="mt-4 flex space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Types</option>
            <option value="fan">Fans</option>
            <option value="ac">Air Conditioners</option>
          </select>

          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Prices</option>
            <option value="0-100">$0 - $100</option>
            <option value="100-300">$100 - $300</option>
            <option value="300-500">$300 - $500</option>
            <option value="500-1000">$500+</option>
          </select>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;