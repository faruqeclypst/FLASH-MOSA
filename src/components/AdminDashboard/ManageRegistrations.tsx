import React from 'react';
import { useRegistrations } from '../../hooks/useRegistrations';
import RegistrationFilters from './RegistrationFilters';
import RegistrationTable from './RegistrationTable';
import RegistrationModal from './RegistrationModal';
import DeleteModal from './DeleteModal';
import { exportToExcel } from '../../utils/exportToExcel';
import { Registration, SchoolCategory, Competition } from '../../types/index';

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

  const openModal = (registration: Registration) => {
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Kelola Pendaftaran</h1>
      
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
  );
};

export default ManageRegistrations;