import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL || '';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
      // 1. Load Razorpay Script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        setError('Failed to load Razorpay SDK. Are you online?');
        setPlacing(false);
        return;
      }

      // 2. Create Razorpay Order on Backend
      const orderDataResponse = await fetch(`${API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ amount: total }),
      });
      const orderData = await orderDataResponse.json();

      if (!orderDataResponse.ok) {
        throw new Error(orderData.message || 'Error occurred while creating payment order');
      }

      // 3. Initialize Razorpay UI
      const options = {
        key: 'rzp_test_change_this', // Typically from an env variable, but safe to hardcode test keys on frontend if needed or fetch from backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'OneClick',
        description: 'Thank you for your purchase',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // 4. Verify Payment Signature on Backend
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
              },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // 5. Payment verified -> Now log the actual backend Order 
              const orderItems = cartItems.map(item => ({
                product: item._id,
                vendor: item.vendor?._id || item.vendor,
                quantity: item.quantity,
                price: item.price,
              }));

              const fullAddress = `${fullName ? fullName + ', ' : ''}${address}${city ? ', ' + city : ''}${zip ? ' - ' + zip : ''}`;

              const orderCreationRes = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                  orderItems,
                  totalPrice: total,
                  address: fullAddress,
                  paymentStatus: 'paid'
                }),
              });

              if (orderCreationRes.ok) {
                const finalOrder = await orderCreationRes.json();
                alert(`✅ Payment successful and Order placed! Order ID: ${finalOrder._id}`);
                clearCart();
                navigate('/customer');
              } else {
                throw new Error('Order creation failed after payment.');
              }
            } else {
              throw new Error('Payment Signature Verification Failed');
            }
          } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error completing the checkout process.');
          } finally {
            setPlacing(false);
          }
        },
        prefill: {
          name: fullName || userInfo.name || 'User',
          email: userInfo.email || 'email@example.com',
          contact: userInfo.phone || '9999999999',
        },
        theme: {
          color: '#f97316', // orange-500
        },
        modal: {
          ondismiss: function() {
            setPlacing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error('Order error:', err);
      setError('Something went wrong. Please try again.');
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
              {/* Payment Info Removed - Razorpay handles this dynamically */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Secure Payment Checkput</h3>
                <p className="text-sm text-orange-700">You will be redirected to Razorpay to complete your payment securely via UPI, Cards, Netbanking, or Wallets.</p>
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
