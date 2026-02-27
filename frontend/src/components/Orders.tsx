import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

interface OrderItem {
  product: {
    _id: string;
    title: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  address: string;
  createdAt: string;
  isPreBooked?: boolean;
  preBookSlot?: string;
  preBookNotes?: string;
}

interface OrdersProps {
  filterPreBooked?: boolean;
}

const Orders = ({ filterPreBooked }: OrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'prebooked' | 'regular'>(
    filterPreBooked ? 'prebooked' : 'all'
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, field: 'deliveryStatus' | 'paymentStatus', value: string) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });
      if (response.ok) {
        setOrders(prev => prev.map(order =>
          order._id === orderId ? { ...order, [field]: value } : order
        ));
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const getStatusColor = (status: string, type: 'delivery' | 'payment') => {
    if (type === 'delivery') {
      switch (status) {
        case 'delivered': return 'bg-green-100 text-green-700';
        case 'shipped': return 'bg-blue-100 text-blue-700';
        case 'cancelled': return 'bg-red-100 text-red-700';
        default: return 'bg-yellow-100 text-yellow-700';
      }
    } else {
      switch (status) {
        case 'paid': return 'bg-green-100 text-green-700';
        case 'failed': return 'bg-red-100 text-red-700';
        default: return 'bg-yellow-100 text-yellow-700';
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'shipped': return '🚚';
      case 'paid': return '💳';
      case 'cancelled': return '❌';
      case 'failed': return '⚠️';
      default: return '⏳';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSlotLabel = (slotId: string) => {
    const slotMap: Record<string, string> = {
      morning: '🌅 Morning (9 AM - 12 PM)',
      afternoon: '☀️ Afternoon (1 PM - 5 PM)',
      evening: '🌇 Evening (5 PM - 8 PM)',
      next_day: '📅 Next Day Morning (9 AM - 12 PM)',
    };
    return slotMap[slotId] || slotId;
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'prebooked') return order.isPreBooked;
    if (activeTab === 'regular') return !order.isPreBooked;
    return true;
  });

  const preBookedCount = orders.filter(o => o.isPreBooked).length;
  const regularCount = orders.filter(o => !o.isPreBooked).length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <span className="bg-orange-100 p-3 rounded-xl">📦</span>
            <span>Manage Orders</span>
          </h2>
          <p className="text-gray-600 mt-2">Track and manage all customer orders</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-blue-600 font-semibold">{filteredOrders.length} Orders</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('prebooked')}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'prebooked'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
        >
          📅 Pre-Bookings ({preBookedCount})
        </button>
        <button
          onClick={() => setActiveTab('regular')}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'regular'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
        >
          Regular Orders ({regularCount})
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <span className="text-6xl mb-4 block">{activeTab === 'prebooked' ? '📅' : '📭'}</span>
          <h3 className="text-xl font-semibold text-gray-800">
            {activeTab === 'prebooked' ? 'No Pre-Bookings Yet' : 'No Orders Yet'}
          </h3>
          <p className="text-gray-600 mt-2">
            {activeTab === 'prebooked'
              ? 'When customers pre-book products, they will appear here.'
              : 'When customers place orders, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className={`bg-white rounded-2xl shadow-md overflow-hidden ${order.isPreBooked ? 'ring-2 ring-purple-300' : ''
                }`}
            >
              {/* Order Header */}
              <div className={`px-6 py-4 border-b flex justify-between items-center ${order.isPreBooked ? 'bg-purple-50' : 'bg-gray-50'
                }`}>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <span className="font-mono font-semibold text-gray-800">{order._id.slice(-8).toUpperCase()}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
                  {order.isPreBooked && (
                    <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <span>📅</span>
                      <span>Pre-Booked</span>
                    </span>
                  )}
                </div>
                <div className="text-xl font-bold text-blue-600">₹{order.totalPrice.toLocaleString()}</div>
              </div>

              {/* Pre-Booking Details (only for pre-booked orders) */}
              {order.isPreBooked && (
                <div className="bg-purple-50 border-b border-purple-100 px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">🕐</span>
                      <div>
                        <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Time Slot</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{getSlotLabel(order.preBookSlot || '')}</p>
                      </div>
                    </div>
                    {order.preBookNotes && (
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">📝</span>
                        <div>
                          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Customer Notes</p>
                          <p className="text-sm text-gray-700 mt-1 bg-white p-2 rounded-lg border border-purple-100">{order.preBookNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Products */}
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-gray-700 mb-3">Products</h4>
                    <div className="space-y-3">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                          <img
                            src={item.product?.image?.startsWith('http') ? item.product.image : `${API_URL}${item.product?.image || ''}`}
                            alt={item.product?.title || 'Product'}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.product?.title || 'Unknown Product'}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <p className="font-semibold text-gray-800">₹{item.quantity * item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer & Status */}
                  <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Customer</h4>
                      <p className="font-medium text-gray-800">{order.customer?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{order.customer?.email || 'No email'}</p>
                      <p className="text-sm text-gray-500 mt-2">📍 {order.address}</p>
                    </div>

                    {/* Status Controls */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Status</label>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus, 'delivery')}`}>
                            {getStatusIcon(order.deliveryStatus)} {order.deliveryStatus}
                          </span>
                          <select
                            value={order.deliveryStatus}
                            onChange={(e) => updateStatus(order._id, 'deliveryStatus', e.target.value)}
                            className="flex-1 px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus, 'payment')}`}>
                            {getStatusIcon(order.paymentStatus)} {order.paymentStatus}
                          </span>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => updateStatus(order._id, 'paymentStatus', e.target.value)}
                            className="flex-1 px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
