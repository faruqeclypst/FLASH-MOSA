import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const HeaderDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
<header className="bg-white shadow-md">
  <nav className="container mx-auto px-6 py-3">
    <div className="flex justify-end items-center">
      <div className="flex items-center space-x-4">
        <Link to="/admin" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
        <Link to="/admin/manage-registrations" className="text-gray-600 hover:text-gray-800">Kelola Pendaftaran</Link>
        <Link to="/admin/manage-content" className="text-gray-600 hover:text-gray-800">Manage Content</Link>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-bold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          <FiLogOut className="mr-2" />
          Keluar
        </button>
      </div>
    </div>
  </nav>
</header>
  );
};

export default HeaderDashboard;