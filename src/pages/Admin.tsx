import React from 'react';
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../components/AdminDashboard/Dashboard';
import ManageContent from '../components/AdminDashboard/ManageContent';
import RegistrationData from '../components/AdminDashboard/RegistrationData';
import Sidebar from '../components/AdminDashboard/Sidebar';
import Header from '../components/AdminDashboard/layout/Header';
import { HomeIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const menuItems = [
    { path: '/admin', icon: HomeIcon, label: 'Dashboard', exact: true },
    { path: '/admin/registrations', icon: UserGroupIcon, label: 'Pendaftaran' },
    { path: '/admin/manage-content', icon: DocumentTextIcon, label: 'Konten' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden md:block fixed top-0 left-0 h-full z-[15]">
        <Sidebar />
      </div>

      <div className="md:pl-16 min-h-screen flex flex-col">
        <div className="fixed top-0 right-0 left-0 md:left-16 z-[15]">
          <Header />
        </div>

        <main className="flex-1 pt-16 pb-16">
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/manage-content" element={<ManageContent />} />
              <Route path="/registrations" element={<RegistrationData />} />
            </Routes>
          </div>
        </main>
        <div className="md:hidden fixed bottom-20 right-4 flex flex-col gap-2 z-[15]">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-blue-500 text-white rounded-full shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[15]">
          <div className="flex justify-around items-center px-2 py-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => classNames(
                  'flex flex-col items-center py-2 px-3 rounded-lg',
                  isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] mt-1">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
};

export default Admin;