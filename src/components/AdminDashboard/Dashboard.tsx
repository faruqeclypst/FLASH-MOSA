import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/admin/manage-registrations" className="bg-blue-600 text-white p-6 rounded-lg text-center hover:bg-blue-700 transition duration-300">
          <h2 className="text-2xl font-bold mb-2">Manage Registrations</h2>
          <p>Review and approve competition registrations</p>
        </Link>
        <Link to="/admin/manage-content" className="bg-green-600 text-white p-6 rounded-lg text-center hover:bg-green-700 transition duration-300">
          <h2 className="text-2xl font-bold mb-2">Manage Content</h2>
          <p>Update website content and settings</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;