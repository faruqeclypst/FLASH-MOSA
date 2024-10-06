import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { DashboardStats, Registration } from '../../types';
import { FiUsers, FiClock, FiCheckCircle, FiXCircle, FiList, FiEdit, FiActivity } from 'react-icons/fi';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Registration[]>([]);

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

        const sortedRegistrations = registrations.sort((a, b) => 
          new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
        );
        
        setRecentActivities(sortedRegistrations.slice(0, 5));
      }
    });
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 mt-16 min-h-screen bg-white">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FiUsers />} title="Total Pendaftaran" value={stats.totalRegistrations} color="bg-blue-500" />
        <StatCard icon={<FiClock />} title="Pendaftaran Tertunda" value={stats.pendingRegistrations} color="bg-yellow-500" />
        <StatCard icon={<FiCheckCircle />} title="Pendaftaran Disetujui" value={stats.approvedRegistrations} color="bg-green-500" />
        <StatCard icon={<FiXCircle />} title="Pendaftaran Ditolak" value={stats.rejectedRegistrations} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ActionCard
          icon={<FiList />}
          title="Kelola Pendaftaran"
          description="Lihat dan kelola pendaftaran pengguna"
          link="/admin/manage-registrations"
        />
        <ActionCard
          icon={<FiEdit />}
          title="Kelola Konten"
          description="Edit, hapus, atau moderasi postingan"
          link="/admin/manage-content"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FiActivity className="mr-2" /> Aktivitas Terbaru
        </h2>
        <ul>
          {recentActivities.map((activity, index) => (
            <li key={index} className="mb-2 pb-2 border-b last:border-b-0">
              <p className="text-sm text-gray-600">
                {activity.teamName || activity.name || activity.registrantName} mendaftar untuk {activity.competition}
              </p>
              <p className="text-xs text-gray-400">
                {format(new Date(activity.registrationDate), 'dd MMMM yyyy HH:mm')}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
  <div className={`${color} rounded-lg shadow-md p-6 text-white`}>
    <div className="flex items-center justify-between">
      <div className="text-3xl">{icon}</div>
      <div className="text-4xl font-bold">{value}</div>
    </div>
    <div className="mt-4 text-lg font-semibold">{title}</div>
  </div>
);

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, link }) => (
  <Link to={link} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
    <div className="flex items-center mb-4">
      <div className="text-3xl text-gray-600 mr-4 flex-shrink-0">{icon}</div>
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </Link>
);

export default Dashboard;