import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">СамокатРент</span>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Баланс: {user.balance.toFixed(2)} ₽</span>
              <Link to="/settings" className="p-2 rounded-full hover:bg-indigo-700">
                <Settings size={20} />
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-indigo-700"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;