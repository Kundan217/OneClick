import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { useCart } from '../context/CartContext';

const Navbar = ({ onSearch, onLocationSearch, onGeoLocationSearch }: { onSearch: (query: string) => void; onLocationSearch: (city: string) => void; onGeoLocationSearch: () => void; }) => {
  const { toggleCart, cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const location = useLocation();

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isSelection = useRef(false);

  // Debounce logic for auto-search & suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // If the update was triggered by selecting an item, don't fetch suggestions again
      if (isSelection.current) {
        isSelection.current = false;
        return;
      }

      if (searchQuery.length > 1) {
        try {
          // Fetch suggestions
          const response = await fetch(`http://localhost:5000/api/products?keyword=${searchQuery}`);
          const data = await response.json();
          setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }

      // Existing auto-search for dashboard
      if (location.pathname === '/customer' || location.pathname === '/') {
        onSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (keyword: string) => {
    isSelection.current = true;
    setSearchQuery(keyword);
    onSearch(keyword);
    setShowSuggestions(false);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLocationSearch(locationQuery);
  };
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/customer" className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">E-Shop</Link>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleLocationSubmit} className="hidden md:flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter your city"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={onGeoLocationSearch} className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300" title="Use my current location">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
          </form>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-full w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-blue-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-xl mt-2 overflow-hidden border border-gray-100 z-50">
                {suggestions.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSuggestionClick(product.title)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center border-b border-gray-50 last:border-none"
                  >
                    <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span className="text-gray-700">{product.title}</span>
                  </div>
                ))}
              </div>
            )}
          </form>
          <button onClick={toggleCart} className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">{cartCount}</span>
            )}
          </button>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
