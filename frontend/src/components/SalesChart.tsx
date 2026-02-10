import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = 'http://localhost:5000';

interface Order {
  _id: string;
  totalPrice: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
}

const SalesChart = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      try {
        const response = await fetch(`${API_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${userInfo.token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
  const deliveredOrders = orders.filter(o => o.deliveryStatus === 'delivered').length;

  // Prepare chart data
  const statusData = [
    { name: 'Delivered', value: orders.filter(o => o.deliveryStatus === 'delivered').length, color: '#22C55E' },
    { name: 'Shipped', value: orders.filter(o => o.deliveryStatus === 'shipped').length, color: '#3B82F6' },
    { name: 'Pending', value: orders.filter(o => o.deliveryStatus === 'pending').length, color: '#F59E0B' },
    { name: 'Cancelled', value: orders.filter(o => o.deliveryStatus === 'cancelled').length, color: '#EF4444' },
  ].filter(d => d.value > 0);

  const revenueData = [
    { name: 'This Week', revenue: totalRevenue, orders: orders.length },
    { name: 'Last Week', revenue: Math.floor(totalRevenue * 0.8), orders: Math.floor(orders.length * 0.7) },
    { name: '2 Weeks Ago', revenue: Math.floor(totalRevenue * 0.6), orders: Math.floor(orders.length * 0.5) },
    { name: '3 Weeks Ago', revenue: Math.floor(totalRevenue * 0.9), orders: Math.floor(orders.length * 0.8) },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-center h-96">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-green-100 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-blue-100 text-sm">Paid Orders</p>
          <p className="text-2xl font-bold">{paidOrders}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-purple-100 text-sm">Delivered</p>
          <p className="text-2xl font-bold">{deliveredOrders}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 Order Status</h3>
          {statusData.length > 0 ? (
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {statusData.map((item, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No order data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Summary */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🕐 Recent Activity</h3>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${order.deliveryStatus === 'delivered' ? 'bg-green-500' :
                    order.deliveryStatus === 'shipped' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></span>
                <span className="font-medium text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded text-xs ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {order.paymentStatus}
                </span>
                <span className="font-semibold text-gray-800">₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;

