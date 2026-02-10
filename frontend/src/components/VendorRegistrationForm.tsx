import { useState } from 'react';

const VendorRegistrationForm = ({ setView }: { setView: (view: string) => void }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    ownerName: '',
    mobile: '',
    email: '',
    password: '',
    address: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'vendor' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      setSuccess('Vendor registration successful! Your account is pending admin approval.');
      setTimeout(() => setView('login'), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Become a Vendor</h2>
      <p className="text-gray-500 mb-8">Join our community of local sellers.</p>
      
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="vendorName" value={formData.vendorName} onChange={handleChange} placeholder="Shop Name" className="px-4 py-3 border rounded-lg" required />
          <input name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Your Name" className="px-4 py-3 border rounded-lg" required />
        </div>
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-3 border rounded-lg" required />
        <input name="mobile" type="tel" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full px-4 py-3 border rounded-lg" required />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Shop Address" className="w-full px-4 py-3 border rounded-lg" required />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 border rounded-lg" required />
        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-3 border rounded-lg" required />
        
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Register as Vendor</button>
      </form>
      <p className="text-center mt-6 text-sm text-gray-600">
        Already a member? 
        <button onClick={() => setView('login')} className="font-semibold text-blue-600 hover:underline ml-1">Login</button>
      </p>
    </div>
  );
};

export default VendorRegistrationForm;
