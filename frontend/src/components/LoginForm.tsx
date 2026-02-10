import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setView, role }: { setView: (view: string) => void; role: string }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Save token and user info to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Navigate based on role
      switch (data.role) {
        case 'customer':
          navigate('/customer');
          break;
        case 'vendor':
          navigate('/vendor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Login Account</h2>
      <p className="text-gray-500 mb-8">Welcome back! Please enter your details.</p>
      
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-gray-700">Email ID</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center space-x-2 text-gray-600">
            <input type="checkbox" className="rounded" />
            <span>Keep me signed in</span>
          </label>
          <button type="button" onClick={() => setView('forgotPassword')} className="font-semibold text-blue-600 hover:underline">Forgot password?</button>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Login</button>
      </form>
      {role !== 'admin' && (
        <p className="text-center mt-6 text-sm text-gray-600">
          Not a member yet? 
          <button onClick={() => setView('register')} className="font-semibold text-blue-600 hover:underline ml-1">Register Now</button>
        </p>
      )}
    </div>
  );
};

export default LoginForm;
