import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`fixed w-full font-bold z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">FLASH 2024</Link>
        <div className="hidden md:flex space-x-4">
          <button onClick={() => scrollToSection('home')} className="text-white hover:text-blue-200">Home</button>
          <button onClick={() => scrollToSection('about')} className="text-white hover:text-blue-200">About</button>
          <button onClick={() => scrollToSection('competitions')} className="text-white hover:text-blue-200">Competitions</button>
          <button onClick={() => scrollToSection('gallery')} className="text-white hover:text-blue-200">Gallery</button>
          <button onClick={() => scrollToSection('contact')} className="text-white hover:text-blue-200">Contact</button>
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
          <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 px-4 text-white hover:bg-blue-700">Home</button>
          <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 px-4 text-white hover:bg-blue-700">About</button>
          <button onClick={() => scrollToSection('competitions')} className="block w-full text-left py-2 px-4 text-white hover:bg-blue-700">Competitions</button>
          <button onClick={() => scrollToSection('gallery')} className="block w-full text-left py-2 px-4 text-white hover:bg-blue-700">Gallery</button>
          <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 px-4 text-white hover:bg-blue-700">Contact</button>
        </div>
      )}
    </header>
  );
};

export default Header;