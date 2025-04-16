import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, name, price, image, colors } = product;

  return (
    <Link to={`/products/${id}`} className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{name}</h3>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-lg font-medium text-gray-900">${price}</p>
        <div className="flex space-x-1">
          {colors.map((color) => (
            <div
              key={color}
              className={`h-4 w-4 rounded-full border border-gray-300`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;