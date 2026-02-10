import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const CheckoutPage = () => {
  const { cartItems, cartCount } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00; // Example shipping cost
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 font-sans">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping & Payment Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping & Payment</h2>
            <form className="space-y-6">
              {/* Shipping Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Shipping Information</h3>
                <input type="text" placeholder="Full Name" className="w-full px-4 py-3 border rounded-lg" />
                <input type="text" placeholder="Address" className="w-full mt-4 px-4 py-3 border rounded-lg" />
                <div className="flex space-x-4 mt-4">
                  <input type="text" placeholder="City" className="w-1/2 px-4 py-3 border rounded-lg" />
                  <input type="text" placeholder="ZIP Code" className="w-1/2 px-4 py-3 border rounded-lg" />
                </div>
              </div>
              {/* Payment Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Payment Details</h3>
                <input type="text" placeholder="Card Number" className="w-full px-4 py-3 border rounded-lg" />
                <div className="flex space-x-4 mt-4">
                  <input type="text" placeholder="MM/YY" className="w-1/2 px-4 py-3 border rounded-lg" />
                  <input type="text" placeholder="CVC" className="w-1/2 px-4 py-3 border rounded-lg" />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary ({cartCount})</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                  <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
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
            <button className="w-full mt-8 bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
