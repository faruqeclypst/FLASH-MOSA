import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { DashboardStats, Registration } from '../../types';
import { format } from 'date-fns';
import Card from '../ui/Card';
import {
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    sdMiRegistrations: 0,
    smpMtsRegistrations: 0,
    smaSmkMaRegistrations: 0,
    umumRegistrations: 0,
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

        const sdMiRegistrations = registrations.filter(r => r.schoolCategory === 'SD/MI').length;
        const smpMtsRegistrations = registrations.filter(r => r.schoolCategory === 'SMP/MTs').length;
        const smaSmkMaRegistrations = registrations.filter(r => r.schoolCategory === 'SMA/SMK/MA').length;
        const umumRegistrations = registrations.filter(r => r.schoolCategory === 'UMUM').length;

        setStats({
          totalRegistrations,
          pendingRegistrations,
          approvedRegistrations,
          rejectedRegistrations,
          sdMiRegistrations,
          smpMtsRegistrations,
          smaSmkMaRegistrations,
          umumRegistrations,
        });

        const sortedRegistrations = registrations.sort((a, b) => 
          new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
        );
        
        setRecentActivities(sortedRegistrations.slice(0, 5));
      }
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard
          icon={<UserGroupIcon />}
          title="Total Pendaftaran"
          value={stats.totalRegistrations}
          total={stats.totalRegistrations}
          color="blue"
        />
        <StatCard
          icon={<ClockIcon />}
          title="Pendaftaran Tertunda"
          value={stats.pendingRegistrations}
          total={stats.totalRegistrations}
          color="yellow"
        />
        <StatCard
          icon={<CheckCircleIcon />}
          title="Pendaftaran Disetujui"
          value={stats.approvedRegistrations}
          total={stats.totalRegistrations}
          color="green"
        />
        <StatCard
          icon={<XCircleIcon />}
          title="Pendaftaran Ditolak"
          value={stats.rejectedRegistrations}
          total={stats.totalRegistrations}
          color="red"
        />
      </div>

      {/* Category Stats & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Category Stats */}
        <Card className="lg:col-span-1 p-3 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              <h3 className="text-sm md:text-base font-semibold text-gray-900">Statistik Pendaftar</h3>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { 
                label: 'SD/MI', 
                value: stats.sdMiRegistrations,
                icon: <DocumentTextIcon className="w-4 h-4 md:w-5 md:h-5" />,
                colors: 'bg-indigo-100 text-indigo-600'
              },
              { 
                label: 'SMP/MTs', 
                value: stats.smpMtsRegistrations,
                icon: <DocumentTextIcon className="w-4 h-4 md:w-5 md:h-5" />,
                colors: 'bg-purple-100 text-purple-600'
              },
              { 
                label: 'SMA/SMK/MA', 
                value: stats.smaSmkMaRegistrations,
                icon: <DocumentTextIcon className="w-4 h-4 md:w-5 md:h-5" />,
                colors: 'bg-pink-100 text-pink-600'
              },
              { 
                label: 'UMUM', 
                value: stats.umumRegistrations,
                icon: <DocumentTextIcon className="w-4 h-4 md:w-5 md:h-5" />,
                colors: 'bg-teal-100 text-teal-600'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 md:p-2 bg-white rounded-lg">
                    <div className={`p-1.5 md:p-2 ${item.colors} rounded-lg`}>
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-600">{item.value} Pendaftar</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm md:text-lg font-bold ${item.colors.split(' ')[1]}`}>
                    {((item.value / stats.totalRegistrations) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">Persentase</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 p-3 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              <h3 className="text-sm md:text-base font-semibold text-gray-900">Pendaftar Terbaru</h3>
            </div>
            <Link 
              to="/admin/manage-registrations"
              className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentActivities.map((activity, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 md:p-2 bg-white rounded-lg">
                    <div className="p-1.5 md:p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <UserGroupIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-900">
                      {activity.teamName || activity.name || activity.registrantName || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {activity.competition}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(activity.registrationDate), 'dd/MM/yyyy')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  total: number;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, total, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="p-3 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${colorClasses[color]}`}>
            {React.cloneElement(icon as React.ReactElement, {
              className: 'w-4 h-4 md:w-5 md:h-5'
            })}
          </div>
          <p className="text-xs md:text-base lg:text-lg font-bold text-gray-900">{title}</p>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1 md:gap-2">
          <p className="text-sm md:text-lg lg:text-xl font-extrabold text-gray-900">
            {value}
          </p>
          <p className="text-xs md:text-xs text-gray-500">
            dari {total}
          </p>
        </div>
      </div>
    </Card>
  );
};

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