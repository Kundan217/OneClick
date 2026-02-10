import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

const CartPanel = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, cartCount } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart ({cartCount})</h2>
          <button onClick={toggleCart} className="p-2 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-center">Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id || item._id} className="flex items-center space-x-4">
                <img src={getImageUrl(item.image)} alt={item.name || item.title} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name || item.title}</h3>
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center bg-blue-500 rounded-full hover:bg-blue-600 text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold text-blue-600 mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item._id || item.id)} className="p-2 rounded-full hover:bg-gray-100">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Subtotal</span>
            <span className="text-2xl font-bold text-blue-600">₹{subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={() => {
              toggleCart();
              navigate('/checkout');
            }}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
