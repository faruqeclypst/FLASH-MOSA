import React from 'react';
import { FiDownload, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
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
  competitions,
  exportToExcel,
  openDeleteAllModal,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari pendaftaran..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-gray-400 text-sm transition-colors"
        />
      </div>

      {/* Filters Group */}
      <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
        {/* Status Filter */}
        <div className="relative min-w-[140px]">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:ring-0 focus:border-gray-400 transition-colors"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
          <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="relative min-w-[140px]">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:ring-0 focus:border-gray-400 transition-colors"
          >
            <option value="all">Semua Kategori</option>
            <option value="SD/MI">SD/MI</option>
            <option value="SMP/MTs">SMP/MTs</option>
            <option value="SMA/SMK/MA">SMA/SMK/MA</option>
            <option value="UMUM">UMUM</option>
          </select>
          <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Competition Filter */}
        <div className="relative min-w-[160px]">
          <select
            value={competitionFilter}
            onChange={(e) => setCompetitionFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:ring-0 focus:border-gray-400 transition-colors"
          >
            <option value="">Semua Kompetisi</option>
            {competitions.map((competition) => (
              <option key={competition} value={competition}>{competition}</option>
            ))}
          </select>
          <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Actions Group */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={exportToExcel}
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors focus:ring-0"
        >
          <FiDownload className="w-4 h-4 mr-2" />
          Export
        </button>
        <button
          onClick={openDeleteAllModal}
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors focus:ring-0"
        >
          <FiTrash2 className="w-4 h-4 mr-2" />
          Hapus Semua
        </button>
      </div>
    </div>
  );
};

export default RegistrationFilters;