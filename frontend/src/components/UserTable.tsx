
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

interface User {
    _id: string;
    name?: string; // Optional as some might not have profiles
    email: string;
    role: string;
    createdAt: string;
}

const UserTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        try {
            const response = await fetch(`${API_URL}/api/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        try {
            const response = await fetch(`${API_URL}/api/auth/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                },
            });

            if (response.ok) {
                setUsers(users.filter(user => user._id !== id));
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            alert('Error deleting user');
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'vendor': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">User Management</h3>
                    <p className="text-sm text-gray-500">View and manage system users</p>
                </div>
                <div className="px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-600 shadow-sm">
                    Total Users: {users.length}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                            <th className="px-6 py-4 font-semibold">User</th>
                            <th className="px-6 py-4 font-semibold">Role</th>
                            <th className="px-6 py-4 font-semibold">Joined</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold uppercase shadow-sm border border-gray-200">
                                            {user.email.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.email.split('@')[0]}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user.role)} uppercase tracking-wide`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100"
                                        title="Delete User"
                                        disabled={user.role === 'admin'} // Prevent deleting admins ideally, or self
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                    No users found.
                </div>
            )}
        </div>
    );
};

export default UserTable;
