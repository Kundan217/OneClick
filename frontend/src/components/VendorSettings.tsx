import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

const VendorSettings = () => {
    const [profile, setProfile] = useState({
        ownerName: '',
        email: '',
        mobile: '',
        vendorName: '',
        storeDescription: '',
        address: '',
        city: '',
        bankAccount: '',
        ifscCode: '',
        shopLogo: '' // Assuming backend supports this later, keeping structure ready
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    // const [uploading, setUploading] = useState(false); // For logo upload in future

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        try {
            const response = await fetch(`${API_URL}/api/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProfile({
                    ownerName: data.ownerName || '',
                    email: data.email || '',
                    mobile: data.mobile || '',
                    vendorName: data.vendorName || '',
                    storeDescription: data.storeDescription || '',
                    address: data.address || '',
                    city: data.city || '',
                    bankAccount: data.bankAccount || '',
                    ifscCode: data.ifscCode || '',
                    shopLogo: data.shopLogo || ''
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

        try {
            const response = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify(profile),
            });

            if (response.ok) {
                setSuccess('Settings updated successfully!');
                // Update local storage if needed, but usually profile refresh handles it
                const data = await response.json();
                // Optionally update userInfo in localStorage if core user details changed
                const updatedUserInfo = { ...userInfo, ...data };
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            } else {
                setError('Failed to update settings');
            }
        } catch (err) {
            setError('An error occurred while updating');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                    <span className="bg-purple-100 p-3 rounded-xl">⚙️</span>
                    <span>Store Settings</span>
                </h2>
                <p className="text-gray-600 mt-2">Manage your store profile, contact info, and payment details</p>
            </div>

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-center">
                    <span className="text-xl mr-2">✅</span>
                    {success}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center">
                    <span className="text-xl mr-2">⚠️</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <span className="mr-2">👤</span> Personal Information
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                            <input
                                type="text"
                                name="ownerName"
                                value={profile.ownerName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
                            <input
                                type="email"
                                value={profile.email}
                                readOnly
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input
                                type="text"
                                name="mobile"
                                value={profile.mobile}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Store Details */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <span className="mr-2">🏪</span> Store Details
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                            <input
                                type="text"
                                name="vendorName"
                                value={profile.vendorName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
                            <textarea
                                name="storeDescription"
                                rows={3}
                                value={profile.storeDescription}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Tell customers about your store..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={profile.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Settings */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <span className="mr-2">💳</span> Payment Information
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
                            <input
                                type="text"
                                name="bankAccount"
                                value={profile.bankAccount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                                placeholder="XXXXXXXXXXXX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={profile.ifscCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono uppercase"
                                placeholder="ABCD0123456"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorSettings;
