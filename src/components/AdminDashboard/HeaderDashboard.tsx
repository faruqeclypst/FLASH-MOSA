import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const HeaderDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="bg-white shadow-md fixed top-0 right-0 left-0 z-50">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/admin" className="text-xl font-bold text-gray-800">Admin Dashboard</Link>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-800 focus:outline-none">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
          <div className={`md:flex items-center space-x-4 ${isMenuOpen ? 'block' : 'hidden'} absolute md:relative top-full right-0 md:top-auto bg-white md:bg-transparent shadow-md md:shadow-none w-full md:w-auto p-4 md:p-0 transition-all duration-300 ease-in-out`}>
            <Link to="/admin" className="block md:inline-block text-gray-600 hover:text-gray-800 py-2 md:py-0">Dashboard</Link>
            <Link to="/admin/manage-registrations" className="block md:inline-block text-gray-600 hover:text-gray-800 py-2 md:py-0">Kelola Pendaftaran</Link>
            <Link to="/admin/manage-content" className="block md:inline-block text-gray-600 hover:text-gray-800 py-2 md:py-0">Manage Content</Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-bold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-2 md:mt-0"
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