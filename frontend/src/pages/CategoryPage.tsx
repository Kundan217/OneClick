import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { type Product } from '../types';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const decodedCategoryName = categoryName ? decodeURIComponent(categoryName) : '';

  useEffect(() => {
    if (!categoryName) return;

    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/products?category=${encodeURIComponent(decodedCategoryName)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products for this category');
        }
        const data = await response.json();
        const formattedData = data.map((p: any) => ({ ...p, name: p.title, id: p._id, _id: p._id }));
        setProducts(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categoryName]);

  return (
    <div className="bg-gray-50 font-sans">
      <Navbar onSearch={(query) => navigate(`/customer?keyword=${query}`)} onLocationSearch={() => { }} onGeoLocationSearch={() => { }} />
      <main className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">{decodedCategoryName}</h1>
        {loading && <p className="text-center">Loading products...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          !loading && !error && <p className="text-center text-gray-600 text-lg">No products found in this category.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
