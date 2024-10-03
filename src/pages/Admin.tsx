import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from '../components/Footer';
import HeaderDashboard from '../components/AdminDashboard/HeaderDashboard';
import Dashboard from '../components/AdminDashboard/Dashboard';
import ManageRegistrations from '../components/AdminDashboard/ManageRegistrations';
import ManageContent from '../components/AdminDashboard/ManageContent';

const Admin: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderDashboard />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manage-registrations" element={<ManageRegistrations />} />
          <Route path="/manage-content" element={<ManageContent />} />
        </Routes>
      <Footer />
    </div>
  );
};

export default Admin;