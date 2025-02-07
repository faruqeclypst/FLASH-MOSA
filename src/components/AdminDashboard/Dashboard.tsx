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
import { FaWhatsapp } from 'react-icons/fa';
import { DataSnapshot } from 'firebase/database';

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

// Update the CompetitionStats interface
interface CompetitionStats {
  name: string;
  isActive: boolean;
  categories: {
    [key: string]: number;
  };
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  income: number;
  registrationFee: number;
}

// Update the CompetitionBreakdown component
const CompetitionBreakdown: React.FC<{ 
  competitions: CompetitionStats[];
  totalRegistrations: number;
  totalIncome: number;
  approvedRegistrations: number;
}> = ({ competitions, totalRegistrations, totalIncome, approvedRegistrations }) => {
  const formatWhatsAppMessage = (competitions: CompetitionStats[]) => {
    let message = `*List Pendaftaran Lomba FLASH*\n`;
    message += `Total Seluruh Pendaftar: ${totalRegistrations}\n`;
    message += `Total Pemasukan (Disetujui): Rp ${totalIncome.toLocaleString('id-ID')}\n\n`;

    competitions.forEach(comp => {
      message += `*${comp.name}*\n`;
      Object.entries(comp.categories)
        .filter(([_, count]) => count > 0)
        .forEach(([category, count]) => {
          message += `${category}: ${count}\n`;
        });
      message += `Disetujui: ${comp.approved}\n`;
      message += `Ditolak: ${comp.rejected}\n`;
      message += `Pending: ${comp.pending}\n`;
      message += `Total: ${comp.total}\n`;
      message += `Pemasukan (Disetujui): Rp ${comp.income.toLocaleString('id-ID')}\n\n`;
    });

    return encodeURIComponent(message);
  };

  const renderCategories = (categories: { [key: string]: number }) => {
    const activeCategories = Object.entries(categories)
      .filter(([_, count]) => count > 0);

    // If only 1 category, duplicate it to maintain layout
    if (activeCategories.length === 1) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {[...Array(2)].map((_, idx) => (
            <div 
              key={idx}
              className={`flex items-center justify-between py-1.5 px-3 rounded ${
                idx === 0 ? 'bg-gray-50' : 'bg-transparent'
              }`}
            >
              {idx === 0 && (
                <>
                  <span className="text-sm text-gray-600">{activeCategories[0][0]}</span>
                  <span className="text-sm font-medium text-gray-900">{activeCategories[0][1]}</span>
                </>
              )}
            </div>
          ))}
        </div>
      );
    }

    // For 2 or more categories, use grid layout
    const gridCols = activeCategories.length > 2 ? 'grid-cols-3' : 'grid-cols-2';
    
    return (
      <div className={`grid ${gridCols} gap-2`}>
        {activeCategories.map(([category, count], idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded"
          >
            <span className="text-sm text-gray-600">{category}</span>
            <span className="text-sm font-medium text-gray-900">{count}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="col-span-1 lg:col-span-3 p-3 md:p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h3 className="text-sm md:text-base font-semibold text-gray-900">
          Statistik Per Lomba
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg w-full sm:w-auto">
              <span className="text-xs text-gray-500">Total Pendaftar:</span>
              <span className="text-sm font-semibold text-gray-900">{totalRegistrations}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg w-full sm:w-auto">
              <span className="text-xs text-emerald-600">Total Pemasukan ({approvedRegistrations} disetujui):</span>
              <span className="text-sm font-semibold text-emerald-700">
                Rp {totalIncome.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
          <a
            href={`https://wa.me/?text=${formatWhatsAppMessage(competitions)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-colors text-sm w-full sm:w-auto"
          >
            <FaWhatsapp className="w-4 h-4" />
            Share
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {competitions.map((comp, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-lg border border-gray-100 overflow-hidden flex flex-col h-[340px] hover:shadow-md transition-shadow"
          >
            {/* Competition Header */}
            <div className={`px-4 py-5 flex items-center justify-between min-h-[72px] ${
              comp.isActive 
                ? 'bg-emerald-50/70 border-b border-emerald-100' 
                : 'bg-rose-50/70 border-b border-rose-100'
            }`}>
              <div className="flex-1 pr-3 flex items-center min-h-[40px]">
                <h4 className="font-bold text-sm text-gray-800 leading-snug break-words line-clamp-2 my-auto">
                  {comp.name}
                </h4>
              </div>
              <div className="flex-shrink-0 flex items-center h-full">
                <span className={`text-xs px-2.5 py-1 rounded-full ${
                  comp.isActive 
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {comp.isActive ? 'Aktif' : 'Ditutup'}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 p-3 flex flex-col bg-gray-50/30">
              {/* Categories Section */}
              <div className="mb-3">
                {renderCategories(comp.categories)}
              </div>
              
              {/* Status Section */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-emerald-50/80 p-2 rounded text-center">
                  <span className="text-xs text-emerald-600 block mb-1">Disetujui</span>
                  <span className="text-sm font-medium text-emerald-700">{comp.approved}</span>
                </div>
                <div className="bg-rose-50/80 p-2 rounded text-center">
                  <span className="text-xs text-rose-600 block mb-1">Ditolak</span>
                  <span className="text-sm font-medium text-rose-700">{comp.rejected}</span>
                </div>
                <div className="bg-amber-50/80 p-2 rounded text-center">
                  <span className="text-xs text-amber-600 block mb-1">Pending</span>
                  <span className="text-sm font-medium text-amber-700">{comp.pending}</span>
                </div>
              </div>

              {/* Footer Section */}
              <div className="mt-auto space-y-2">
                <div className="flex items-center justify-between bg-gray-100/80 p-2 rounded">
                  <span className="text-sm font-medium text-gray-700">Total Pendaftar</span>
                  <span className="text-sm font-bold text-gray-900">{comp.total}</span>
                </div>
                <div className="flex items-center justify-between bg-sky-50/80 p-2 rounded">
                  <span className="text-sm font-medium text-sky-700">Biaya Pendaftaran</span>
                  <span className="text-sm font-bold text-sky-700">
                    Rp {comp.registrationFee.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-emerald-50/80 p-2 rounded">
                  <span className="text-sm font-medium text-emerald-700">Pemasukan</span>
                  <span className="text-sm font-bold text-emerald-700">
                    Rp {comp.income.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

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
  const [competitionStats, setCompetitionStats] = useState<CompetitionStats[]>([]);

  useEffect(() => {
    const db = getDatabase();
    const registrationsRef = ref(db, 'registrations');
    const flashEventRef = ref(db, 'flashEvent');
    
    Promise.all([
      new Promise<DataSnapshot>(resolve => onValue(registrationsRef, resolve, { onlyOnce: true })),
      new Promise<DataSnapshot>(resolve => onValue(flashEventRef, resolve, { onlyOnce: true }))
    ]).then(([registrationsSnapshot, flashEventSnapshot]) => {
      const registrationsData = registrationsSnapshot.val();
      const flashEventData = flashEventSnapshot.val();
      
      if (registrationsData && flashEventData) {
        const registrations = Object.values(registrationsData) as Registration[];
        
        // Calculate competition stats
        const compStats = flashEventData.competitions.map((comp: any) => {
          const compRegistrations = registrations.filter(r => r.competition === comp.name);
          // Only count approved registrations for income
          const approvedRegistrations = compRegistrations.filter(r => r.status === 'approved');
          
          const categories = {
            'SD/MI': compRegistrations.filter(r => r.schoolCategory === 'SD/MI').length,
            'SMP/MTs': compRegistrations.filter(r => r.schoolCategory === 'SMP/MTs').length,
            'SMA/SMK/MA': compRegistrations.filter(r => r.schoolCategory === 'SMA/SMK/MA').length,
            'UMUM': compRegistrations.filter(r => r.schoolCategory === 'UMUM').length,
          };

          // Calculate income only from approved registrations
          const income = approvedRegistrations.length * (comp.registrationFee || 0);

          return {
            name: comp.name,
            isActive: comp.isActive,
            categories,
            total: compRegistrations.length,
            approved: approvedRegistrations.length,
            rejected: compRegistrations.filter(r => r.status === 'rejected').length,
            pending: compRegistrations.filter(r => r.status === 'pending').length,
            registrationFee: comp.registrationFee || 0,
            income
          };
        });

        // Calculate total income from all approved registrations
        const totalIncome = compStats.reduce((sum: number, comp: CompetitionStats) => sum + comp.income, 0);

        setCompetitionStats(compStats);
        
        // Update existing stats
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

      {/* Add Competition Breakdown */}
      <CompetitionBreakdown 
        competitions={competitionStats}
        totalRegistrations={stats.totalRegistrations}
        totalIncome={competitionStats.reduce((sum: number, comp: CompetitionStats) => sum + comp.income, 0)}
        approvedRegistrations={stats.approvedRegistrations}
      />
    </div>
  );
};

export default Dashboard;