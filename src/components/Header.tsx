import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-blue-600' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">FLASH 2024</Link>
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="text-white hover:text-blue-200">Home</Link>
          <Link to="/about" className="text-white hover:text-blue-200">About</Link>
          <Link to="/competitions" className="text-white hover:text-blue-200">Competitions</Link>
          <Link to="/gallery" className="text-white hover:text-blue-200">Gallery</Link>
          <Link to="/contact" className="text-white hover:text-blue-200">Contact</Link>
          {user && <Link to="/admin" className="text-white hover:text-blue-200">Admin</Link>}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
              ) : (
                <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className="md:hidden bg-blue-600">
          <Link to="/" className="block py-2 px-4 text-white hover:bg-blue-700" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="block py-2 px-4 text-white hover:bg-blue-700" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/competitions" className="block py-2 px-4 text-white hover:bg-blue-700" onClick={() => setIsOpen(false)}>Competitions</Link>
          <Link to="/gallery" className="block py-2 px-4 text-white hover:bg-blue-700" onClick={() => setIsOpen(false)}>Gallery</Link>
          <Link to="/contact" className="block py-2 px-4 text-white hover:bg-blue-700" onClick={() => setIsOpen(false)}>Contact</Link>
          {user && <Link to="/admin" className="block py-2 px-4 text-white hover:bg-blue-700" onClick={() => setIsOpen(false)}>Admin</Link>}
        </div>
      )}
    </header>
  );
};

export default Header;