import React from 'react';
import { useRegistrations } from '../../hooks/useRegistrations';
import RegistrationFilters from './RegistrationFilters';
import RegistrationTable, { ExtendedRegistration } from './RegistrationTable';
import RegistrationModal from './RegistrationModal';
import DeleteModal from './DeleteModal';
import { exportToExcel } from '../../utils/exportToExcel';
import { Registration } from '../../types/index';
import { UserGroupIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import StatCardLite from '../ui/StatCardLite';

const ManageRegistrations: React.FC = () => {
  const {
    registrations,
    competitions,
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
    paginatedRegistrations,
    currentPage,
    setCurrentPage,
    pageCount,
    handleStatusChange,
    handleDelete,
    handleDeleteAll,
    selectedRegistration,
    setSelectedRegistration,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleteAllModalOpen,
    setIsDeleteAllModalOpen,
    registrationToDelete,
    setRegistrationToDelete,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
  } = useRegistrations();

  const openModal = (registration: ExtendedRegistration) => {
    setSelectedRegistration(registration);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRegistration(null);
    setIsModalOpen(false);
  };

  const openDeleteModal = (id: string) => {
    const registration = registrations?.[id];
    if (registration) {
      setRegistrationToDelete(id);
      setIsDeleteModalOpen(true);
    }
  };

  const closeDeleteModal = () => {
    setRegistrationToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openDeleteAllModal = () => {
    setIsDeleteAllModalOpen(true);
  };

  const closeDeleteAllModal = () => {
    setIsDeleteAllModalOpen(false);
  };

  return (
    <div className="bg-gray-50">
      <div className="p-6 h-full">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <StatCardLite
              icon={<UserGroupIcon className="w-5 h-5 text-blue-600" />}
              label="Total Pendaftar"
              value={registrations ? Object.keys(registrations).length : 0}
              className="bg-blue-50 border-blue-200"
              valueColor="text-blue-600"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <StatCardLite
              icon={<ClockIcon className="w-5 h-5 text-yellow-600" />}
              label="Menunggu"
              value={Object.values(registrations || {}).filter(r => r.status === 'pending').length}
              className="bg-yellow-50 border-yellow-200"
              valueColor="text-yellow-600"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <StatCardLite
              icon={<CheckCircleIcon className="w-5 h-5 text-green-600" />}
              label="Disetujui"
              value={Object.values(registrations || {}).filter(r => r.status === 'approved').length}
              className="bg-green-50 border-green-200"
              valueColor="text-green-600"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <StatCardLite
              icon={<XCircleIcon className="w-5 h-5 text-red-600" />}
              label="Ditolak"
              value={Object.values(registrations || {}).filter(r => r.status === 'rejected').length}
              className="bg-red-50 border-red-200"
              valueColor="text-red-600"
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="max-w-full overflow-x-auto">
              <RegistrationFilters
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                competitionFilter={competitionFilter}
                setCompetitionFilter={setCompetitionFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                competitions={competitions?.map(c => c.name) || []}
                exportToExcel={() => {
                  if (registrations) {
                    exportToExcel(registrations, competitions || []);
                  }
                }}
                openDeleteAllModal={openDeleteAllModal}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md">
            <div className="max-w-full overflow-x-auto">
              <RegistrationTable
                paginatedRegistrations={paginatedRegistrations}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageCount={pageCount}
                handleStatusChange={handleStatusChange}
                openModal={openModal}
                openDeleteModal={openDeleteModal}
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        {selectedRegistration && (
          <RegistrationModal
            registration={selectedRegistration}
            onClose={closeModal}
          />
        )}

        {isDeleteModalOpen && registrationToDelete && (
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={() => {
              handleDelete(registrationToDelete);
              closeDeleteModal();
            }}
            itemName="pendaftaran"
            registrationCode={registrations?.[registrationToDelete]?.registrationCode}
            nameOrTeam={
              registrations?.[registrationToDelete]?.teamName ||
              registrations?.[registrationToDelete]?.name ||
              registrations?.[registrationToDelete]?.registrantName
            }
          />
        )}

        {isDeleteAllModalOpen && (
          <DeleteModal
            isOpen={isDeleteAllModalOpen}
            onClose={closeDeleteAllModal}
            onConfirm={() => {
              handleDeleteAll();
              closeDeleteAllModal();
            }}
            itemName="semua pendaftaran"
          />
        )}
      </div>
    </div>
  );
};

export default ManageRegistrations;