import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you'd clear auth tokens here
    navigate('/');
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
