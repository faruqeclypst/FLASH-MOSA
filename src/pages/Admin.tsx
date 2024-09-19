import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import Header from '../components/Header';
import Footer from '../components/Footer';
import Dashboard from '../components/AdminDashboard/Dashboard';
import ManageRegistrations from '../components/AdminDashboard/ManageRegistrations';
import ManageContent from '../components/AdminDashboard/ManageContent';

const Admin: React.FC = () => {
  return (
    <div>
      {/* <Header /> */}
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