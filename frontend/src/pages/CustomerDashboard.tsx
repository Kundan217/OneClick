import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import CategoryBrowser from '../components/CategoryBrowser';
import Footer from '../components/Footer';
import { type Product } from '../types';

const CustomerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState<{ name?: string } | null>(null);

  const fetchProducts = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    let url = 'http://localhost:5000/api/products';

    if (keyword) {
      url = `http://localhost:5000/api/products?keyword=${keyword}`;
    } else if (city) {
      url = `http://localhost:5000/api/products?city=${city}`;
    } else if (lat && lon) {
      url = `http://localhost:5000/api/products?lat=${lat}&lon=${lon}`;
    }

    fetchProducts(url);

    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, [searchParams]);

  const handleSearch = (query: string) => setSearchParams({ keyword: query });

  const handleLocationSearch = (city: string) => {
    if (city) {
      fetchProducts(`http://localhost:5000/api/products?city=${city}`);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchProducts(`http://localhost:5000/api/products?lat=${latitude}&lon=${longitude}`);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Could not get location. Enter city manually.");
        }
      );
    } else {
      setError("Geolocation not supported.");
    }
  };

  const handleGeoLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchProducts(`http://localhost:5000/api/products?lat=${latitude}&lon=${longitude}`);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Location access denied.");
        }
      );
    }
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen flex flex-col">
      <Navbar onSearch={handleSearch} onLocationSearch={handleLocationSearch} onGeoLocationSearch={handleGeoLocationSearch} />

      <main className="flex-grow">
        <Hero />

        <div className="container mx-auto px-6 py-12 space-y-20">

          {/* Welcome Section */}
          <div className="text-center space-y-4 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              {userInfo?.name ? `Welcome back, ${userInfo.name}!` : 'Discover Local Excellence'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore unique handcrafted goods and sustainable products from vendors near you.
            </p>
          </div>

          <CategoryBrowser />

          {/* Product Grid Section */}
          <div id="products" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">
                Featured Collection
              </h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all">
                View All products →
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-96 animate-pulse shadow-sm border border-gray-100"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-red-500 font-medium mb-2">Note</p>
                <p className="text-gray-700">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-white text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {products.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Promotional Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10 px-10 py-16 md:py-20 text-center max-w-3xl mx-auto space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold">Join Our Community Newsletter</h3>
              <p className="text-blue-100 text-lg">Get exclusive access to new vendor launches, seasonal discounts, and curated collections delivered to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="px-6 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none w-full"
                />
                <button className="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
