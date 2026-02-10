import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AddProduct from '../components/AddProduct';
import Orders from '../components/Orders';
import SalesChart from '../components/SalesChart';
import VendorSettings from '../components/VendorSettings';

const API_URL = 'http://localhost:5000';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  countInStock: number;
  image: string;
  description?: string;
  category?: string;
}

const VendorDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats>({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [vendorName, setVendorName] = useState('');

  // Edit Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ title: '', price: 0, countInStock: 0, description: '' });

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const products = await response.json();

      setStats({
        totalProducts: products.length,
        totalOrders: Math.floor(Math.random() * 50) + 10,
        totalRevenue: products.reduce((sum: number, p: any) => sum + p.price, 0),
        pendingOrders: Math.floor(Math.random() * 10) + 2
      });

      setAllProducts(products);
      setRecentProducts(products.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    // Prioritize Store Name (vendorName), then Owner Name, then Name (customer), then fallback
    const displayName = userInfo.vendorName || userInfo.ownerName || userInfo.name || 'Merchant';
    setVendorName(displayName);
    fetchProducts();
  }, []);

  // Delete Product
  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });

      if (response.ok) {
        setAllProducts(prev => prev.filter(p => p._id !== productId));
        setRecentProducts(prev => prev.filter(p => p._id !== productId));
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  // Open Edit Modal
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      title: product.title,
      price: product.price,
      countInStock: product.countInStock,
      description: product.description || ''
    });
    setShowEditModal(true);
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const response = await fetch(`${API_URL}/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setAllProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...updatedProduct } : p));
        setRecentProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...updatedProduct } : p));
        setShowEditModal(false);
        setEditingProduct(null);
        alert('Product updated successfully!');
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  const StatCard = ({ title, value, icon, color, suffix = '' }: { title: string; value: number | string; icon: string; color: string; suffix?: string }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}{suffix}</p>
        </div>
        <div className={`text-4xl opacity-80`}>{icon}</div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-8">
      {/* Welcome Section */}
      {/* Welcome Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {vendorName}! 👋</h2>
          <p className="text-blue-100 text-lg">Here's what's happening with your store today.</p>
        </div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-20 h-20 bg-white opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Products" value={stats.totalProducts} icon="📦" color="border-blue-500" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon="🛒" color="border-green-500" />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon="💰" color="border-purple-500" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" color="border-orange-500" />
      </div>

      {/* Charts and Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Products</h3>
          <div className="space-y-4">
            {recentProducts.length === 0 ? (
              <p className="text-gray-500">No products yet</p>
            ) : (
              recentProducts.map((product) => (
                <div key={product._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{product.title}</p>
                    <p className="text-sm text-gray-500">Stock: {product.countInStock}</p>
                  </div>
                  <p className="font-semibold text-blue-600">₹{product.price}</p>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setActiveView('addProduct')}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveView('addProduct')}
          className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
        >
          <span className="text-2xl">➕</span>
          <span className="font-semibold">Add New Product</span>
        </button>
        <button
          onClick={() => setActiveView('orders')}
          className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md"
        >
          <span className="text-2xl">📋</span>
          <span className="font-semibold">View All Orders</span>
        </button>
        <button
          onClick={() => setActiveView('products')}
          className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
        >
          <span className="text-2xl">🏷️</span>
          <span className="font-semibold">Manage Products</span>
        </button>
      </div>
    </div>
  );

  // My Products View
  const renderProducts = () => (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Products</h2>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setActiveView('addProduct')}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Product</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No products yet. Add your first product!</p>
          </div>
        ) : (
          allProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={getImageUrl(product.image)}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'addProduct':
        return <AddProduct />;
      case 'orders':
        return <Orders />;
      case 'products':
        return renderProducts();
      case 'settings':
        return <VendorSettings />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex">
      <Sidebar setActiveView={setActiveView} />
      <main className="flex-1 h-screen overflow-y-auto bg-gray-100">
        {renderContent()}
      </main>

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Edit Product</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={editForm.countInStock}
                    onChange={(e) => setEditForm({ ...editForm, countInStock: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;

