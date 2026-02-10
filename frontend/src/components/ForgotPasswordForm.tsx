import { useState } from 'react';

const ForgotPasswordForm = ({ setView }: { setView: (view: string) => void }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      setSuccess('Password reset link has been sent to your email.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h2>
      <p className="text-gray-500 mb-8">Enter your email to receive a reset link.</p>
      
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}

      <form onSubmit={handleForgotPassword} className="space-y-6">
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
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Send Reset Link</button>
      </form>
      <p className="text-center mt-6 text-sm text-gray-600">
        Remember your password? 
        <button onClick={() => setView('login')} className="font-semibold text-blue-600 hover:underline ml-1">Login</button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
