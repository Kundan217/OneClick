import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  title: string;
  price: number;
  discount: number;
  image: string;
  rating: number;
  numReviews: number;
  slug: string;
  category?: { name: string };
}

interface AISearchBarProps {
  /** Called when a search completes; if omitted, results display inline */
  onResults?: (products: Product[]) => void;
}

const AISearchBar = ({ onResults }: AISearchBarProps) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[] | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (onResults) {
        onResults(data.products);
      } else {
        setResults(data.products);
      }
    } catch {
      setError('Could not connect to AI search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const discountedPrice = (price: number, discount: number) =>
    discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <style>{`
        @keyframes aiPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(139,92,246,0); }
        }
        @keyframes resultFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .ai-search-ring:focus-within { animation: aiPulse 2s ease-in-out infinite; }
        .result-card { animation: resultFadeIn 0.4s ease forwards; }
        .shimmer-bar {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
      `}</style>

      {/* Search Bar */}
      <div
        id="ai-search-bar"
        className="ai-search-ring flex items-center gap-2 bg-white rounded-2xl shadow-lg border border-purple-100 px-4 py-3 transition-all duration-300"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 text-sm">
          ✨
        </div>
        <input
          id="ai-search-input"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Ask AI: "cheap red shoes", "best rated electronics"...'
          className="flex-1 bg-transparent outline-none text-gray-700 text-sm placeholder-gray-400"
        />
        <button
          id="ai-search-button"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:scale-100 whitespace-nowrap"
        >
          {loading ? '🔍 Searching...' : 'AI Search'}
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow">
              <div className="shimmer-bar h-28 rounded-xl mb-3"></div>
              <div className="shimmer-bar h-3 rounded-full mb-2"></div>
              <div className="shimmer-bar h-3 w-2/3 rounded-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 text-center text-red-500 text-sm bg-red-50 rounded-xl py-3 px-4">
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {results !== null && !loading && (
        <div className="mt-6">
          {results.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🔎</div>
              <p className="text-gray-500 text-sm">No products matched your query. Try different keywords!</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-3 px-1">
                ✨ AI found <span className="text-purple-600 font-semibold">{results.length} products</span> for "{query}"
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {results.map((product, i) => (
                  <div
                    key={product._id}
                    id={`ai-result-${i}`}
                    className="result-card bg-white rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
                    style={{ animationDelay: `${i * 60}ms` }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <div className="relative overflow-hidden h-28 bg-gray-50">
                      <img
                        src={product.image?.startsWith('http') ? product.image : `${product.image}`}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Product'; }}
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-lg">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-gray-800 text-xs font-semibold line-clamp-2 leading-tight mb-1.5">
                        {product.title}
                      </p>
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-gray-500 text-xs">{product.rating?.toFixed(1)}</span>
                        <span className="text-gray-300 text-xs">({product.numReviews})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-purple-700 font-bold text-sm">
                          ₹{discountedPrice(product.price, product.discount).toLocaleString()}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-gray-400 text-xs line-through">₹{product.price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AISearchBar;
