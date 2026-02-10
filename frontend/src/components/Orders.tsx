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
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <span className="bg-orange-100 p-3 rounded-xl">📦</span>
            <span>Manage Orders</span>
          </h2>
          <p className="text-gray-600 mt-2">Track and manage all customer orders</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-blue-600 font-semibold">{orders.length} Orders</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <span className="text-6xl mb-4 block">📭</span>
          <h3 className="text-xl font-semibold text-gray-800">No Orders Yet</h3>
          <p className="text-gray-600 mt-2">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <span className="font-mono font-semibold text-gray-800">{order._id.slice(-8).toUpperCase()}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
                </div>
                <div className="text-xl font-bold text-blue-600">₹{order.totalPrice.toLocaleString()}</div>
              </div>

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

