import React from 'react';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import { SchoolCategory } from '../../types/index';

interface DateFilter {
  startDate: string;
  endDate: string;
}

interface RegistrationFiltersProps {
  filterStatus: "all" | "pending" | "approved" | "rejected";
  setFilterStatus: React.Dispatch<React.SetStateAction<"all" | "pending" | "approved" | "rejected">>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  categoryFilter: "all" | SchoolCategory;
  setCategoryFilter: React.Dispatch<React.SetStateAction<"all" | SchoolCategory>>;
  competitionFilter: string;
  setCompetitionFilter: React.Dispatch<React.SetStateAction<string>>;
  dateFilter: DateFilter;
  setDateFilter: React.Dispatch<React.SetStateAction<DateFilter>>;
  competitions: string[];
  exportToExcel: () => void;
  openDeleteAllModal: () => void;
}

const RegistrationFilters: React.FC<RegistrationFiltersProps> = ({
  filterStatus,
  setFilterStatus,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  competitionFilter,
  setCompetitionFilter,
  dateFilter,
  setDateFilter,
  competitions,
  exportToExcel,
  openDeleteAllModal,
}) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter((prev: DateFilter) => ({ ...prev, startDate: e.target.value }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter((prev: DateFilter) => ({ ...prev, endDate: e.target.value }));
  };

  return (
    <div className="mb-8 bg-white rounded-xl shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">Cari Pendaftaran</label>
          <input
            id="search"
            type="text"
            placeholder="Cari pendaftaran..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "pending" | "approved" | "rejected")}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
          <select
            id="category"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as "all" | SchoolCategory)}
          >
            <option value="all">Semua Kategori</option>
            <option value="SD/MI">SD/MI</option>
            <option value="SMP/MTs">SMP/MTs</option>
            <option value="SMA/SMK/MA">SMA/SMK/MA</option>
            <option value="UMUM">UMUM</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="competition" className="block text-sm font-medium text-gray-700">Kompetisi</label>
          <select
            id="competition"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={competitionFilter}
            onChange={(e) => setCompetitionFilter(e.target.value)}
          >
            <option value="">Semua Kompetisi</option>
            {competitions.map((competition) => (
              <option key={competition} value={competition}>{competition}</option>
            ))}
          </select>
        </div>

        {/* <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
          <input
            id="startDate"
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={dateFilter.startDate}
            onChange={handleStartDateChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Tanggal Akhir</label>
          <input
            id="endDate"
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={dateFilter.endDate}
            onChange={handleEndDateChange}
          />
        </div> */}
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={exportToExcel}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
        >
          <FiDownload className="mr-2" />
          Export to Excel
        </button>
        <button
          onClick={openDeleteAllModal}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
        >
          <FiTrash2 className="mr-2" />
          Hapus Semua
        </button>
      </div>
    </div>
  );
};

export default RegistrationFilters;