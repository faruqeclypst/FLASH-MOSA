import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import '../../styles/adminDashboard.css';
import { DashboardStats, Registration } from '../../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
  });

  useEffect(() => {
    const db = getDatabase();
    const registrationsRef = ref(db, 'registrations');
    
    onValue(registrationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const registrations = Object.values(data) as Registration[];
        const totalRegistrations = registrations.length;
        const pendingRegistrations = registrations.filter(r => r.status === 'pending').length;
        const approvedRegistrations = registrations.filter(r => r.status === 'approved').length;
        const rejectedRegistrations = registrations.filter(r => r.status === 'rejected').length;

        setStats({
          totalRegistrations,
          pendingRegistrations,
          approvedRegistrations,
          rejectedRegistrations,
        });
      }
    });
  }, []);

  return (
    <div className="admin-dashboard">
      <main className="dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-card total">
            <h3>Total Registrations</h3>
            <p>{stats.totalRegistrations}</p>
          </div>
          <div className="stat-card pending">
            <h3>Pending Registrations</h3>
            <p>{stats.pendingRegistrations}</p>
          </div>
          <div className="stat-card approved">
            <h3>Approved Registrations</h3>
            <p>{stats.approvedRegistrations}</p>
          </div>
          <div className="stat-card rejected">
            <h3>Rejected Registrations</h3>
            <p>{stats.rejectedRegistrations}</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/admin/manage-registrations" className="action-card">
            <h2>Manage Registrations</h2>
            <p>View and manage user registrations</p>
          </Link>
          <Link to="/admin/manage-content" className="action-card">
            <h2>Manage Content</h2>
            <p>Edit, delete, or moderate posts</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;