import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import Dashboard from '../components/AdminDashboard/Dashboard';
import ManageRegistrations from '../components/AdminDashboard/ManageRegistrations';
import ManageContent from '../components/AdminDashboard/ManageContent';
import Sidebar from '../components/AdminDashboard/Sidebar';
import HeaderDashboard from '../components/AdminDashboard/HeaderDashboard';
import { HomeIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

const Admin: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: HomeIcon,
      exact: true
    },
    { 
      name: 'Pendaftaran', 
      href: '/admin/manage-registrations', 
      icon: UserGroupIcon 
    },
    { 
      name: 'Konten', 
      href: '/admin/manage-content', 
      icon: DocumentTextIcon 
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 flex flex-col ${isMobile ? 'pb-16' : 'md:ml-64'}`}>
        <HeaderDashboard />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/manage-registrations" element={<ManageRegistrations />} />
            <Route path="/manage-content" element={<ManageContent />} />
          </Routes>
        </div>

        {/* Footer - Hidden on mobile */}
        <footer className="hidden md:block sticky bottom-0 left-0 right-0 py-4 px-6 text-center text-sm text-gray-600 border-t bg-white shadow-md z-10">
          <p>© {new Date().getFullYear()} FLASH MOSA. All rights reserved.</p>
        </footer>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="flex items-center justify-around">
            {navigation.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    "flex flex-col items-center py-2 px-3 text-xs",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600"
                  )}
                >
                  <item.icon 
                    className={classNames(
                      "w-6 h-6 mb-1",
                      isActive ? "text-blue-600" : "text-gray-400"
                    )} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Admin;