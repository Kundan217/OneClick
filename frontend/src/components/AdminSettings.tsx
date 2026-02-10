
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

const AdminSettings = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        setEmail(userInfo.email || '');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

        try {
            const response = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    email,
                    password: password || undefined,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update local storage
                localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data }));
                setMessage('Profile updated successfully');
                setPassword('');
                setConfirmPassword('');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to update profile');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">⚙️</span>
                Admin Settings
            </h2>

            {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm font-medium">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                            required
                        />
                        <span className="absolute right-4 top-3.5 text-gray-400">✉️</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                            placeholder="••••••••"
                        />
                        <span className="absolute right-4 top-3.5 text-gray-400">🔒</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                            placeholder="••••••••"
                        />
                        <span className="absolute right-4 top-3.5 text-gray-400">🔐</span>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:translate-y-px transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
