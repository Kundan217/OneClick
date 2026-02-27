import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:5000';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, clearCart } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token) {
      alert('Please login to place an order.');
      navigate('/auth');
      return;
    }

    if (!address.trim()) {
      setError('Please enter your delivery address.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setPlacing(true);
    setError('');

    try {
      const orderItems = cartItems.map(item => ({
        product: item._id,
        vendor: item.vendor?._id || item.vendor,
        quantity: item.quantity,
        price: item.price,
      }));

      const fullAddress = `${fullName ? fullName + ', ' : ''}${address}${city ? ', ' + city : ''}${zip ? ' - ' + zip : ''}`;

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems,
          totalPrice: total,
          address: fullAddress,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        alert(`✅ Order placed successfully! Order ID: ${order._id}`);
        clearCart();
        navigate('/customer');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      <Navbar
        onSearch={(query) => navigate(`/customer?keyword=${query}`)}
        onLocationSearch={() => { }}
        onGeoLocationSearch={() => { }}
      />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping & Payment Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping & Payment</h2>
            <div className="space-y-6">
              {/* Shipping Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Shipping Information</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Address *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <div className="flex space-x-4 mt-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>
              </div>
              {/* Payment Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Payment Details</h3>
                <input type="text" placeholder="Card Number" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                <div className="flex space-x-4 mt-4">
                  <input type="text" placeholder="MM/YY" className="w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                  <input type="text" placeholder="CVC" className="w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary ({cartCount})</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item._id || item.id} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.name || item.title} (x{item.quantity})</span>
                  <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-gray-800">₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-4 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placing || cartItems.length === 0}
              className="w-full mt-8 bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
            >
              {placing ? '⏳ Placing Order...' : '🛒 Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
