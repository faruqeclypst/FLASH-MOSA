import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const HeaderDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    try {
      return format(date, 'EEEE, dd MMMM yyyy', { locale: id });
    } catch (error) {
      return format(date, 'EEEE, dd MMMM yyyy');
    }
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm:ss');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left side - DateTime */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <div className="text-sm text-gray-600">
              {formatDate(currentTime)}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(currentTime)}
            </div>
          </div>
          {/* Mobile DateTime */}
          <div className="md:hidden">
            <div className="text-xs text-gray-600">
              {formatDate(currentTime)}
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Right side - User & Logout */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiUser className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="text-xs text-gray-600">
                Selamat datang,
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Mobile User Icon */}
          <div className="md:hidden p-2 bg-gray-50 rounded-lg">
            <FiUser className="w-5 h-5 text-gray-600" />
          </div>

          {/* Divider */}
          <div className="hidden md:block h-8 w-px bg-gray-200" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden md:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;