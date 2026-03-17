import { type Product } from '../types';

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';

const API_URL = import.meta.env.VITE_API_URL || '';

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the Link from navigating
    addToCart(product);
  };

  // Get full image URL
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300 ease-in-out">
        <img src={getImageUrl(product.image)} alt={product.title} className="w-full h-56 object-cover" />
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 truncate">{product.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={product.rating || 0} size="sm" />
            {(product.numReviews ?? 0) > 0 && (
              <span className="text-xs text-gray-500">({product.numReviews})</span>
            )}
          </div>
          <p className="text-lg text-blue-600 font-semibold mt-2">₹{product.price}</p>
          <button
            onClick={handleAddToCart}
            className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
