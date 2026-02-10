import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import VendorTable from '../components/VendorTable';
import UserTable from '../components/UserTable';
import AdminSettings from '../components/AdminSettings';
import LogoutButton from '../components/LogoutButton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:5000';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalRevenue: 0,
    pendingRequests: 0
  });
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      // Fetch Stats
      const statsRes = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch Analytics
      const analyticsRes = await fetch(`${API_URL}/api/admin/analytics`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      const analyticsInfo = await analyticsRes.json();
      setAnalyticsData(analyticsInfo);

    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'from-blue-500 to-indigo-600', trend: '+Live' },
    { title: 'Active Vendors', value: stats.totalVendors || 0, icon: '🏪', color: 'from-emerald-500 to-teal-600', trend: '+Live' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, icon: '💰', color: 'from-violet-500 to-purple-600', trend: '+Revenue' },
    { title: 'Pending Vendors', value: stats.pendingRequests || 0, icon: '⏳', color: 'from-amber-500 to-orange-600', trend: 'Action Needed' },
  ];

  /* Stats Card Component */
  const StatCard = ({ stat }: { stat: any }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:scale-110 transition-transform`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
          <span className="text-2xl">{stat.icon}</span>
        </div>
        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stat.trend === 'Action Needed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {stat.trend}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.title}</h3>
        <p className="text-3xl font-extrabold text-gray-800 mt-1">{stat.value}</p>
      </div>
    </div>
  );

  /* Invite Modal Component */
  const InviteModal = () => {
    if (!showInviteModal) return null;

    // Fallback if window.location is waiting
    const inviteLink = `http://localhost:5173/auth?role=vendor`;

    const handleCopy = () => {
      navigator.clipboard.writeText(inviteLink);
      alert('Link copied to clipboard!');
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
            <h3 className="text-2xl font-bold">Invite New Vendor</h3>
            <p className="text-blue-100 mt-2 text-sm">Grow your marketplace by inviting top sellers</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                📢
              </div>
              <p className="text-gray-600 mb-4">
                Share this unique registration link with vendors. They can sign up and create their store instantly.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="w-full bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-xl px-4 py-3 pr-24 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 rounded-lg transition-colors shadow-sm"
              >
                Copy Link
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  window.location.href = `mailto:?subject=Join%20our%20Marketplace&body=Hey!%20Join%20our%20platform%20as%20a%20vendor%20here:%20${inviteLink}`;
                }}
                className="flex items-center justify-center space-x-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                <span>📧</span> <span>Email</span>
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className="py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">Overview of system performance and metrics</p>
        </div>
        <LogoutButton />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Analytics (Last 30 Days)</h3>
        <div className="h-80 w-full">
          {analyticsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="_id" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No revenue data available for the chart yet. Create some orders!
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderVendors = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Vendor Management</h2>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Invite Vendor</span>
        </button>
      </div>
      <VendorTable />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <AdminSidebar setActiveView={setActiveView} />

      {/* Invite Modal */}
      <InviteModal />

      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'vendors' && renderVendors()}
          {activeView === 'users' && <UserTable />}
          {activeView === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
