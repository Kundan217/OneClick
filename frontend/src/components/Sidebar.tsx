import { useState } from 'react';
import LogoutButton from './LogoutButton';

const Sidebar = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
  const [active, setActive] = useState('dashboard');

  const handleClick = (view: string) => {
    setActive(view);
    setActiveView(view);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'addProduct', label: 'Add Product', icon: '➕' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'products', label: 'My Products', icon: '🏷️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 flex flex-col shadow-xl">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">🛍️ Vendor Panel</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your store</p>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`w-full text-left flex items-center space-x-3 py-3 px-4 mb-2 rounded-lg transition-all duration-200 ${active === item.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'hover:bg-gray-700 hover:text-white'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-700/50 rounded-lg">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            V
          </div>
          <div>
            <p className="text-white font-medium text-sm">Vendor</p>
            <p className="text-gray-400 text-xs">Store Owner</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;

