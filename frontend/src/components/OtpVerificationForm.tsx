import { useState } from 'react';

const OtpVerificationForm = ({ email, setView }: { email: string, setView: (view: string) => void }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setSuccess('Account verified successfully!');
      setTimeout(() => {
        // Technically this logs them in and returns a token. 
        // For simplicity, we can redirect them to login so AuthContext handles the token natively.
        // Or if we had access to auth context here, we could log them straight in.
        setView('login');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setSuccess('A new OTP has been sent to your email.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full animate-fade-in-up">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
      <p className="text-gray-500 mb-8">We sent a 6-digit code to <strong>{email}</strong></p>
      
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-gray-700">Enter OTP</label>
          <input 
            type="text" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="123456"
            className="w-full mt-2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg font-semibold"
            required
          />
        </div>
        <button 
            type="submit" 
            disabled={loading || otp.length < 6}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${loading || otp.length < 6 ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
            {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
      <div className="flex flex-col items-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            Didn't receive the code? 
            <button onClick={handleResend} className="font-semibold text-blue-600 hover:underline ml-1">Resend OTP</button>
          </p>
          <p className="text-sm text-gray-600">
             <button onClick={() => setView('login')} className="font-semibold text-gray-500 hover:underline">Back to Login</button>
          </p>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
