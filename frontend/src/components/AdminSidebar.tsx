
import { useState } from 'react';

const AdminSidebar = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const [active, setActive] = useState('dashboard');

    const handleClick = (view: string) => {
        setActive(view);
        setActiveView(view);
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'vendors', label: 'Manage Vendors', icon: '🏪' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col shadow-2xl sidebar-transition">
            {/* Brand */}
            <div className="p-6 border-b border-gray-800 flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <span className="text-2xl">🛡️</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                        Admin Panel
                    </h1>
                    <p className="text-xs text-gray-400">System Administrator</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleClick(item.id)}
                        className={`w-full text-left flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-300 group ${active === item.id
                                ? 'bg-blue-600 shadow-lg text-white scale-105'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1'
                            }`}
                    >
                        <span className={`text-xl transition-transform duration-300 ${active === item.id ? 'rotate-12' : 'group-hover:rotate-12'}`}>
                            {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-800/50 rounded-xl mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-inner">
                        A
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">Admin</p>
                        <p className="text-xs text-gray-400">admin@system.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
