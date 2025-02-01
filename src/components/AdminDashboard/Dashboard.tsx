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
  DocumentTextIcon
} from '@heroicons/react/24/outline';

// Komponen StatCard
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  total: number;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, total, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-green-800',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="p-3 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${colorClasses[color]}`}>
            {React.cloneElement(icon as React.ReactElement, {
              className: 'w-4 h-4 md:w-5 md:h-5'
            })}
          </div>
          <p className="text-xs md:text-base lg:text-lg font-bold text-gray-900">{title}</p>
        </div>
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

// Komponen CategoryStats
interface CategoryStatsProps {
  stats: DashboardStats;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ stats }) => {
  const categories = [
    { 
      label: 'SD/MI', 
      value: stats.sdMiRegistrations,
      colors: 'bg-indigo-100 text-indigo-600'
    },
    { 
      label: 'SMP/MTs', 
      value: stats.smpMtsRegistrations,
      colors: 'bg-purple-100 text-purple-600'
    },
    { 
      label: 'SMA/SMK/MA', 
      value: stats.smaSmkMaRegistrations,
      colors: 'bg-pink-100 text-pink-600'
    },
    { 
      label: 'UMUM', 
      value: stats.umumRegistrations,
      colors: 'bg-teal-100 text-teal-600'
    }
  ];

  return (
    <Card className="lg:col-span-1 p-3 md:p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm md:text-base font-semibold text-gray-900">Statistik Pendaftar</h3>
        </div>
      </div>
      <div className="space-y-3">
        {categories.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-1.5 md:p-2 bg-white rounded-lg">
                <div className={`p-1.5 md:p-2 ${item.colors} rounded-lg`}>
                  <DocumentTextIcon className="w-4 h-4 md:w-5 md:h-5" />
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
  );
};

// Komponen RecentActivities
interface RecentActivitiesProps {
  activities: Registration[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => (
  <Card className="lg:col-span-2 p-3 md:p-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-sm md:text-base font-semibold text-gray-900">Pendaftar Terbaru</h3>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {activities.map((activity, idx) => (
        <div 
          key={idx} 
          className="flex items-center justify-between p-2 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 bg-white rounded-lg">
              <div className="p-1.5 md:p-2 bg-blue-100 text-green-800 rounded-lg">
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
);

// Komponen Dashboard Utama
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
        
        // Update stats
        setStats({
          totalRegistrations: registrations.length,
          pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
          approvedRegistrations: registrations.filter(r => r.status === 'approved').length,
          rejectedRegistrations: registrations.filter(r => r.status === 'rejected').length,
          sdMiRegistrations: registrations.filter(r => r.schoolCategory === 'SD/MI').length,
          smpMtsRegistrations: registrations.filter(r => r.schoolCategory === 'SMP/MTs').length,
          smaSmkMaRegistrations: registrations.filter(r => r.schoolCategory === 'SMA/SMK/MA').length,
          umumRegistrations: registrations.filter(r => r.schoolCategory === 'UMUM').length,
        });

        // Update recent activities
        const sortedRegistrations = [...registrations].sort((a, b) => 
          new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
        );
        setRecentActivities(sortedRegistrations.slice(0, 8));
      }
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard
          icon={<UserGroupIcon />}
          title="Pendaftar"
          value={stats.totalRegistrations}
          total={stats.totalRegistrations}
          color="blue"
        />
        <StatCard
          icon={<ClockIcon />}
          title="Pending"
          value={stats.pendingRegistrations}
          total={stats.totalRegistrations}
          color="yellow"
        />
        <StatCard
          icon={<CheckCircleIcon />}
          title="Disetujui"
          value={stats.approvedRegistrations}
          total={stats.totalRegistrations}
          color="green"
        />
        <StatCard
          icon={<XCircleIcon />}
          title="Ditolak"
          value={stats.rejectedRegistrations}
          total={stats.totalRegistrations}
          color="red"
        />
      </div>

      {/* Category Stats & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <CategoryStats stats={stats} />
        <RecentActivities activities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;