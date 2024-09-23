import React, { useState, useEffect, useCallback, memo } from 'react';
import { useFirebase } from '../../hooks/useFirebase';
import { Registration, Competition } from '../../types';
import { Tab } from '@headlessui/react';
import { Menu } from '@headlessui/react';
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown, FiDownload } from 'react-icons/fi';
import { format, parse, isWithinInterval } from 'date-fns';
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 5;

const ManageRegistrations: React.FC = () => {
  const { data: registrations, updateData, deleteData } = useFirebase<Record<string, Registration>>('registrations');
  const { data: competitions } = useFirebase<Record<string, Competition>>('competitions');
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
  }, [registrations, filterStatus, searchTerm, sortField, sortDirection, sortRegistrations, dateFilter, competitionFilter]);

  const pageCount = Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE);
  const paginatedRegistrations = filteredRegistrations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleStatusChange = useCallback(async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    if (registrations && registrations[id].status !== newStatus) {
      await updateData({ [id]: { ...registrations[id], status: newStatus } });
    }
  }, [registrations, updateData]);

  const handleDelete = useCallback(async () => {
    if (registrationToDelete) {
      await deleteData(registrationToDelete);
      setIsDeleteModalOpen(false);
      setRegistrationToDelete(null);
    }
  }, [deleteData, registrationToDelete]);

  const openModal = useCallback((registration: Registration) => {
    setSelectedRegistration(registration);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedRegistration(null);
    setIsModalOpen(false);
  }, []);

  const openDeleteModal = useCallback((id: string) => {
    setRegistrationToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setRegistrationToDelete(null);
    setIsDeleteModalOpen(false);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') return null;
        return 'asc';
      });
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    if (sortDirection === 'asc') return <FiArrowUp className="inline ml-1" />;
    if (sortDirection === 'desc') return <FiArrowDown className="inline ml-1" />;
    return null;
  };

  const exportToExcel = (status: 'all' | 'approved' | 'rejected' | 'pending') => {
    const dataToExport = status === 'all' ? filteredRegistrations : filteredRegistrations.filter(([_, reg]) => reg.status === status);
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(([_, reg]) => ({
      'Kode Pendaftaran': reg.registrationCode,
      'Tanggal Pendaftaran': format(new Date(reg.registrationDate), 'dd/MM/yyyy HH:mm'),
      'Nama/Tim': reg.teamName || reg.name || reg.registrantName,
      'Anggota Tim': reg.teamMembers ? reg.teamMembers.join(', ') : 'N/A',
      'WhatsApp': reg.whatsapp,
      'Kategori': reg.schoolCategory,
      'Sekolah': reg.school || 'N/A',
      'Kompetisi': reg.competition,
      'Kota': reg.city,
      'Email': reg.email,
      'Status': reg.status,
      'Jenis Kelamin': reg.gender || 'N/A',
      'Tanggal Lahir': reg.birthDate || 'N/A',
      'KTS/Surat Aktif': reg.ktsSuratAktif ? 'Ada' : 'Tidak Ada',
      'Bukti Pembayaran': reg.buktiPembayaran ? 'Ada' : 'Tidak Ada'
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, `registrations_${status}.xlsx`);
  };

  const renderRegistrationDetails = (registration: Registration) => {
    const isTeam = !!registration.teamName || (registration.teamMembers && registration.teamMembers.length > 0);
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <section>
            <h4 className="font-semibold text-lg text-gray-700 mb-2">
              {isTeam ? 'Informasi Tim' : 'Informasi Peserta'}
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><span className="font-medium">Tanggal Daftar:</span> {registration.registrationDate
                  ? format(new Date(registration.registrationDate), 'dd MMMM yyyy (HH:mm)')
                  : 'Tidak tersedia'}
              </p>
              <p><span className="font-medium">Kode Pendaftaran:</span> {registration.registrationCode}</p>
              {isTeam ? (
                <>
                  <p><span className="font-medium">Nama Pendaftar:</span> {registration.registrantName}</p>
                  <p><span className="font-medium">Nama Tim:</span> {registration.teamName}</p>
                  {registration.teamMembers && registration.teamMembers.length > 0 && (
                    <div>
                      <span className="font-medium">Anggota Tim:</span>
                      <ul className="list-disc list-inside ml-4">
                        {registration.teamMembers.map((member, index) => (
                          <li key={index}>{member}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p><span className="font-medium">Nama Lengkap:</span> {registration.name || registration.registrantName}</p>
                  {registration.gender && <p><span className="font-medium">Jenis Kelamin:</span> {registration.gender}</p>}
                  {registration.birthDate && <p><span className="font-medium">Tanggal Lahir:</span> {registration.birthDate}</p>}
                </>
              )}
              <p><span className="font-medium">No. WhatsApp:</span> {registration.whatsapp}</p>
              <p><span className="font-medium">Email:</span> {registration.email}</p>
            </div>
          </section>
  
          <section>
            <h4 className="font-semibold text-lg text-gray-700 mb-2">Detail Kompetisi</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Kompetisi:</span> {registration.competition}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold
                  ${registration.status === 'approved' ? 'bg-green-200 text-green-800' : 
                    registration.status === 'rejected' ? 'bg-red-200 text-red-800' : 
                    'bg-yellow-200 text-yellow-800'}`}>
                  {registration.status === 'approved' ? 'Disetujui' : 
                   registration.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                </span>
              </p>
            </div>
          </section>
          
          <section>
            <h4 className="font-semibold text-lg text-gray-700 mb-2">Informasi Sekolah</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Kategori Sekolah:</span> {registration.schoolCategory}</p>
              {registration.school && <p><span className="font-medium">Nama Sekolah:</span> {registration.school}</p>}
            </div>
          </section>
          
          <section>
            <h4 className="font-semibold text-lg text-gray-700 mb-2">Lokasi</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">Kota/Kabupaten:</span> {registration.city}</p>
            </div>
          </section>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-700 mb-2">Dokumen</h4>
          {registration.ktsSuratAktif && (
            <section className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">KTS / Surat Aktif:</p>
              <a href={registration.ktsSuratAktif} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mb-2 inline-block">
                Unduh KTS / Surat Aktif
              </a>
              <div className="mt-2 border border-gray-300 rounded-lg overflow-hidden h-44">
                <iframe
                  src={`${registration.ktsSuratAktif}#toolbar=0`}
                  className="w-full h-full"
                  title="KTS / Surat Aktif"
                >
                  Browser Anda tidak mendukung tampilan PDF. Silakan unduh file untuk melihatnya.
                </iframe>
              </div>
            </section>
          )}
          {registration.buktiPembayaran && (
            <section className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Bukti Pembayaran:</p>
              <a href={registration.buktiPembayaran} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mb-2 inline-block">
                Unduh Bukti Pembayaran
              </a>
              <div className="mt-2 border border-gray-300 rounded-lg overflow-hidden h-44">
                <iframe
                  src={`${registration.buktiPembayaran}#toolbar=0`}
                  className="w-full h-full"
                  title="Bukti Pembayaran"
                >
                  Browser Anda tidak mendukung tampilan PDF. Silakan unduh file untuk melihatnya.
                </iframe>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  };

  if (!registrations) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Kelola Pendaftaran</h1>
      
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Cari pendaftaran..."
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          value={dateFilter.startDate}
          onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 rounded"
          value={dateFilter.endDate}
          onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
        />
        <select
          className="p-2 border border-gray-300 rounded"
          value={competitionFilter}
          onChange={(e) => setCompetitionFilter(e.target.value)}
        >
          <option value="all">Semua Kompetisi</option>
          {competitions && Object.values(competitions).map((comp, index) => (
            <option key={index} value={comp.name}>{comp.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => exportToExcel('all')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            <FiDownload className="inline mr-2" />
            Export All
          </button>
          <button
            onClick={() => exportToExcel('approved')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            <FiDownload className="inline mr-2" />
            Export Approved
          </button>
          <button
            onClick={() => exportToExcel('rejected')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            <FiDownload className="inline mr-2" />
            Export Rejected
          </button>
          <button
            onClick={() => exportToExcel('pending')}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
          >
            <FiDownload className="inline mr-2" />
            Export Pending
          </button>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl mb-8">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Tab
              key={status}
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-blue-700 rounded-lg
                focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
                ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
              onClick={() => setFilterStatus(status as any)}
            >
              {status === 'all' ? 'Semua' :
               status === 'pending' ? 'Menunggu' :
               status === 'approved' ? 'Disetujui' : 'Ditolak'}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels>
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Tab.Panel key={status} className="bg-white rounded-xl p-6 shadow-md overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('registrationCode')}>
                      Kode {renderSortIcon('registrationCode')}
                    </th>
                    <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('registrationDate')}>
                      Tanggal {renderSortIcon('registrationDate')}
                    </th>
                    <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('name')}>
                      Nama/Tim {renderSortIcon('name')}
                    </th>
                    <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('schoolCategory')}>
                      Kategori {renderSortIcon('schoolCategory')}
                    </th>
                    <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('school')}>
                      Sekolah {renderSortIcon('school')}
                    </th>
                    <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('competition')}>
                      Kompetisi {renderSortIcon('competition')}
                    </th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                {paginatedRegistrations
                  .filter(([_, reg]) => status === 'all' || reg.status === status)
                  .map(([id, registration], index) => {
                    const isTeam = !!registration.teamName || (registration.teamMembers && registration.teamMembers.length > 0);
                    return (
                      <tr key={id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td className="p-3">{registration.registrationCode}</td>
                        <td className="p-3">{format(new Date(registration.registrationDate), 'dd/MM/yyyy HH:mm')}</td>
                        <td className="p-3">
                          {isTeam 
                            ? registration.teamName
                            : (registration.name || registration.registrantName || 'N/A')}
                        </td>
                        <td className="p-3">{registration.schoolCategory || 'N/A'}</td>
                        <td className="p-3">{registration.school || 'N/A'}</td>
                        <td className="p-3">{registration.competition}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${registration.status === 'approved' ? 'bg-green-200 text-green-800' : 
                              registration.status === 'rejected' ? 'bg-red-200 text-red-800' : 
                              'bg-yellow-200 text-yellow-800'}`}>
                            {registration.status === 'approved' ? 'Disetujui' : 
                             registration.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openModal(registration)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                            >
                              Detail
                            </button>
                            <Menu as="div" className="relative inline-block text-left">
                              {({ open }) => (
                                <>
                                  <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                    style={{
                                      backgroundColor: 
                                        registration.status === 'approved' ? '#34D399' :
                                        registration.status === 'rejected' ? '#EF4444' : '#FBBF24'
                                    }}
                                  >
                                    {registration.status === 'approved' ? 'Disetujui' : 
                                     registration.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                    <FiChevronDown
                                      className="w-5 h-5 ml-2 -mr-1 text-white"
                                      aria-hidden="true"
                                    />
                                  </Menu.Button>
                                  {open && (
                                    <Menu.Items static className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                      <div className="px-1 py-1">
                                        {['approved', 'rejected', 'pending'].map((status) => (
                                          <Menu.Item key={status}>
                                            {({ active }) => (
                                              <button
                                                className={`${
                                                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                onClick={() => handleStatusChange(id, status as any)}
                                              >
                                                {status === 'approved' ? 'Disetujui' : 
                                                 status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                              </button>
                                            )}
                                          </Menu.Item>
                                        ))}
                                      </div>
                                    </Menu.Items>
                                  )}
                                </>
                              )}
                            </Menu>
                            <button
                              onClick={() => openDeleteModal(id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedRegistrations.filter(([_, reg]) => status === 'all' || reg.status === status).length < ITEMS_PER_PAGE && 
                    Array(ITEMS_PER_PAGE - paginatedRegistrations.filter(([_, reg]) => status === 'all' || reg.status === status).length).fill(null).map((_, index) => (
                      <tr key={`empty-${index}`} className="border-b">
                        <td colSpan={9} className="p-3">&nbsp;</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <FiChevronLeft className="mr-2" />
                  Sebelumnya
                </button>
                <span className="text-sm text-gray-700">
                  Halaman {currentPage} dari {pageCount}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                  disabled={currentPage === pageCount}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Selanjutnya
                  <FiChevronRight className="ml-2" />
                </button>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      {/* Modal for registration details */}
      {isModalOpen && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={closeModal}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-2xl font-semibold text-gray-900">Detail Pendaftaran</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 text-xl font-bold">
                  &times;
                </button>
              </div>
              {renderRegistrationDetails(selectedRegistration)}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for delete confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={closeDeleteModal}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Konfirmasi Penghapusan</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus pendaftaran ini? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={closeDeleteModal}
                    className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default memo(ManageRegistrations);