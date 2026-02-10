import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import CustomerRegistrationForm from '../components/CustomerRegistrationForm';
import VendorRegistrationForm from '../components/VendorRegistrationForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'customer';
  const [view, setView] = useState('login'); // login, register, forgotPassword

  useEffect(() => {
    if (role === 'admin') {
      setView('login');
    }
  }, [role]);

  // Dynamic Theme Configuration based on Role
  const getTheme = () => {
    switch (role) {
      case 'vendor':
        return {
          bgGradient: 'from-emerald-600 to-teal-700',
          accentColor: 'text-emerald-600',
          welcomeText: 'Grow Your Business',
          subText: 'Join our community of sellers and reach millions of customers today.'
        };
      case 'admin':
        return {
          bgGradient: 'from-slate-800 to-gray-900',
          accentColor: 'text-slate-800',
          welcomeText: 'System Administration',
          subText: 'Secure access for platform management and oversight.'
        };
      default: // customer
        return {
          bgGradient: 'from-blue-600 to-indigo-700',
          accentColor: 'text-blue-600',
          welcomeText: 'Welcome Back!',
          subText: 'Discover unique handcrafted goods and everyday essentials.'
        };
    }
  };

  const theme = getTheme();

  const renderForm = () => {
    switch (view) {
      case 'login':
        return <LoginForm setView={setView} role={role} />;
      case 'register':
        return role === 'vendor' ? <VendorRegistrationForm setView={setView} /> : <CustomerRegistrationForm setView={setView} />;
      case 'forgotPassword':
        return <ForgotPasswordForm setView={setView} />;
      default:
        return <LoginForm setView={setView} role={role} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      <div className="flex w-full max-w-5xl h-[750px] bg-white shadow-2xl rounded-3xl overflow-hidden transition-all duration-500">

        {/* Left Panel - Visuals */}
        <div className={`hidden lg:flex w-1/2 bg-gradient-to-br ${theme.bgGradient} text-white p-16 flex-col justify-between relative overflow-hidden transition-colors duration-500`}>
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full mix-blend-overlay filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full mix-blend-overlay filter blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse animation-delay-2000"></div>

          <div className="relative z-10">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase opacity-80 mb-2">E-Shop Platform</h2>
            <div className="h-1 w-12 bg-white rounded-full opacity-50"></div>
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">
              {view === 'register' ? 'Join Us Today' : 'Nice to see you again'}
            </h1>
            <p className="text-xl font-light opacity-90 leading-relaxed">
              {theme.welcomeText}
            </p>
            <p className="text-sm opacity-75 max-w-xs">
              {theme.subText}
            </p>
          </div>

          <div className="relative z-10 text-xs opacity-60">
            &copy; {new Date().getFullYear()} E-Shop Inc. Secure Login.
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-white">
          <Link
            to="/"
            className="absolute top-8 left-8 flex items-center text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium"
          >
            ← Back to Role Selection
          </Link>

          <div className="mt-8 animate-fade-in-up">
            {renderForm()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
