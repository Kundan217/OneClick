import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';

interface TrackingEvent {
  status: string;
  message: string;
  location?: string;
  timestamp: string;
}

interface OrderItem {
  product: { _id: string; title: string; image: string; price: number };
  vendor: { vendorName: string, email: string, city: string };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  deliveryStatus: string;
  paymentStatus: string;
  trackingTimeline: TrackingEvent[];
  createdAt: string;
}

const CustomerProfile = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    if (!userInfo.token) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/my-orders`, {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err: any) {
        setError('Error fetching order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'processing': return '⚙️';
      case 'shipped': return '🚚';
      case 'out_for_delivery': return '🛵';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📍';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Navbar onSearch={() => {}} onLocationSearch={() => {}} onGeoLocationSearch={() => {}} />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
               <div className="flex items-center space-x-4 mb-6">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                   {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-gray-800">{userInfo.name || 'User'}</h2>
                   <p className="text-sm text-gray-500">{userInfo.email}</p>
                 </div>
               </div>

               <nav className="space-y-2">
                 <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                 >
                   📦 My Orders
                 </button>
                 <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                 >
                   👤 Profile Settings
                 </button>
               </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-2xl shadow-md p-8 min-h-[500px]">
              
              {activeTab === 'profile' && (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h3>
                  <p className="text-gray-500">Your profile information is managed by the system administraton.</p>
                  <div className="mt-6 border border-gray-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium text-gray-800">{userInfo.name}</p>
                  </div>
                  <div className="mt-4 border border-gray-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="font-medium text-gray-800">{userInfo.email}</p>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800">Order History & Tracking</h3>
                  </div>

                  {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading your orders...</div>
                  ) : error ? (
                    <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <span className="text-5xl block mb-4">📭</span>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h4>
                      <p className="text-gray-500">Looks like you haven't made any purchases yet.</p>
                      <button onClick={() => navigate('/customer')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {orders.map(order => (
                        <div key={order._id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                          {/* Order Header */}
                          <div className="bg-gray-50 p-4 md:px-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Order Placed</p>
                              <p className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                              <p className="font-bold text-blue-600">₹{order.totalPrice.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Order ID</p>
                              <p className="font-mono text-xs text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">{order._id.toUpperCase()}</p>
                            </div>
                          </div>

                          {/* Order Items & Tracking */}
                          <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                            
                            {/* Products List */}
                            <div className="lg:w-1/2 space-y-4">
                              <h4 className="font-semibold text-gray-700 border-b pb-2">Items</h4>
                              {order.orderItems.map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-4">
                                  <img 
                                    src={item.product?.image?.startsWith('http') ? item.product.image : `${API_URL}${item.product?.image || ''}`} 
                                    alt={item.product?.title || 'Product'} 
                                    className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-800 line-clamp-1">{item.product?.title || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500">Sold by: {item.vendor?.vendorName || 'Unknown'}</p>
                                    <p className="text-sm font-semibold text-gray-700 mt-1">{item.quantity} × ₹{item.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Tracking Timeline */}
                            <div className="lg:w-1/2">
                              <h4 className="font-semibold text-gray-700 border-b pb-2 mb-4">Tracking</h4>
                              <div className="relative pl-6 space-y-6">
                                {/* Vertical Line */}
                                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

                                {order.trackingTimeline && order.trackingTimeline.length > 0 ? (
                                  order.trackingTimeline.slice().reverse().map((event, idx) => (
                                    <div key={idx} className="relative">
                                      <div className={`absolute -left-8 mt-1.5 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center ${idx === 0 ? 'bg-blue-600 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]' : 'bg-gray-300'}`}></div>
                                      
                                      <div className={`p-4 rounded-xl border ${idx === 0 ? 'border-blue-100 bg-blue-50/50' : 'border-gray-100 bg-white'}`}>
                                        <div className="flex items-center justify-between mb-1">
                                          <h5 className="font-semibold text-gray-800 capitalize flex items-center space-x-2">
                                            <span>{getStatusIcon(event.status)}</span>
                                            <span>{event.status.replace(/_/g, ' ')}</span>
                                          </h5>
                                          <span className="text-xs text-gray-500">
                                            {new Date(event.timestamp).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{event.message}</p>
                                        {event.location && (
                                          <p className="text-xs text-gray-400 mt-2 flex items-center">
                                            <span className="mr-1">📍</span> {event.location}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-gray-500 italic text-sm">No tracking information available yet.</div>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerProfile;
