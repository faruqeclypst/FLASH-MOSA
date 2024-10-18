import { useState, useEffect, useCallback } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { Registration, Competition, SchoolCategory } from '../types/index';
import { format, parse, isWithinInterval } from 'date-fns';

export const useRegistrations = () => {
  const { data: registrations, updateData, deleteData } = useFirebase<Record<string, Registration>>('registrations');
  const { data: flashEventData } = useFirebase<{ competitions: Competition[] }>('flashEvent');
  const competitions = flashEventData?.competitions;

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegistrations, setFilteredRegistrations] = useState<[string, Registration][]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [competitionFilter, setCompetitionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState<SchoolCategory | 'all'>('all');
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 5;

  const sortRegistrations = useCallback((registrations: [string, Registration][]) => {
    if (!sortField || sortDirection === null) return registrations;
  
    return [...registrations].sort((a, b) => {
      let aValue: string = (a[1][sortField as keyof Registration] as string) || '';
      let bValue: string = (b[1][sortField as keyof Registration] as string) || '';
  
      if (sortField === 'name') {
        aValue = a[1].teamName || a[1].name || a[1].registrantName || '';
        bValue = b[1].teamName || b[1].name || b[1].registrantName || '';
      } else if (sortField === 'registrationDate') {
        aValue = new Date(a[1].registrationDate).toISOString();
        bValue = new Date(b[1].registrationDate).toISOString();
      }
  
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [sortField, sortDirection]);

  useEffect(() => {
    if (registrations) {
      let filtered = Object.entries(registrations).filter(([_, registration]) => 
        (filterStatus === 'all' || registration.status === filterStatus) &&
        (competitionFilter === 'all' || registration.competition === competitionFilter) &&
        (categoryFilter === 'all' || registration.schoolCategory === categoryFilter) &&
        (registration.registrationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.registrantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.schoolCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.school?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         registration.competition.toLowerCase().includes(searchTerm.toLowerCase()) ||
         format(new Date(registration.registrationDate), 'dd/MM/yyyy').includes(searchTerm) ||
         registration.status.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      if (dateFilter.startDate && dateFilter.endDate) {
        const startDate = parse(dateFilter.startDate, 'yyyy-MM-dd', new Date());
        const endDate = parse(dateFilter.endDate, 'yyyy-MM-dd', new Date());
        filtered = filtered.filter(([_, registration]) => {
          const regDate = new Date(registration.registrationDate);
          return isWithinInterval(regDate, { start: startDate, end: endDate });
        });
      }

      filtered = sortRegistrations(filtered);
      setFilteredRegistrations(filtered);
      setCurrentPage(1);
    }
  }, [registrations, filterStatus, searchTerm, sortField, sortDirection, sortRegistrations, dateFilter, competitionFilter, categoryFilter]);

  const pageCount = Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE);
  const paginatedRegistrations = filteredRegistrations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleStatusChange = useCallback(async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    if (registrations && registrations[id].status !== newStatus) {
      if (newStatus === 'approved') {
        const registration = registrations[id];
        const name = registration.teamName || registration.name || registration.registrantName;
        const message = `Selamat pendaftaran anda telah disetujui, ${registration.registrationCode}, ${name}, ${registration.competition}, ${format(new Date(registration.registrationDate), 'dd/MM/yyyy')}. Untuk Informasi Selanjutnya silahkan menghubungi panitia FLASH SMAN MODAL BANGSA`;
  
        const whatsappUrl = `https://wa.me/${registration.whatsapp}?text=${encodeURIComponent(message)}`;
  
        if (confirm(`Kirim WhatsApp Konfirmasi ke ${name}?`)) {
          window.open(whatsappUrl, '_blank');
          await updateData({ [id]: { ...registrations[id], status: 'approved' } });
        } else {
          await updateData({ [id]: { ...registrations[id], status: 'pending' } });
        }
      } else {
        await updateData({ [id]: { ...registrations[id], status: newStatus } });
      }
    }
  }, [registrations, updateData]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteData(id);
  }, [deleteData]);

  const handleDeleteAll = useCallback(async () => {
    if (registrations) {
      const registrationIds = Object.keys(registrations);
      for (const id of registrationIds) {
        await deleteData(id);
      }
    }
  }, [registrations, deleteData]);

  return {
    registrations,
    competitions,
    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,
    filteredRegistrations,
    selectedRegistration,
    setSelectedRegistration,
    isModalOpen,
    setIsModalOpen,
    currentPage,
    setCurrentPage,
    pageCount,
    paginatedRegistrations,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    registrationToDelete,
    setRegistrationToDelete,
    dateFilter,
    setDateFilter,
    competitionFilter,
    setCompetitionFilter,
    categoryFilter,
    setCategoryFilter,
    isDeleteAllModalOpen,
    setIsDeleteAllModalOpen,
    handleStatusChange,
    handleDelete,
    handleDeleteAll,
  };
};