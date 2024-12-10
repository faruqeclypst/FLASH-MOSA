import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { Registration, SchoolCategory } from '../../types/index';
import { format } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown, FiChevronDown } from 'react-icons/fi';
import { Menu } from '@headlessui/react';
import classNames from 'classnames';

// Tambahkan type untuk status badge
type BadgeProps = {
  status: Registration['status'];
  adminStatus?: 'diterima' | 'ditolak';
  className?: string;
};

// Komponen StatusBadge
const StatusBadge: React.FC<BadgeProps> = ({ status, adminStatus, className }) => {
  const getStatusLabel = (status: Registration['status'], adminStatus?: string) => {
    if (adminStatus) {
      return adminStatus === 'diterima' ? 'Diterima' : 'Ditolak';
    }
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Registration['status'], adminStatus?: string) => {
    if (adminStatus) {
      return adminStatus === 'diterima' 
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800';
    }
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={classNames(
      'px-2 py-1 rounded-full text-sm font-medium',
      getStatusColor(status, adminStatus),
      className
    )}>
      {getStatusLabel(status, adminStatus)}
    </span>
  );
};

// Komponen JalurBadge
const JalurBadge: React.FC<{ jalur: string }> = ({ jalur }) => {
  const getJalurColor = (jalur: string) => {
    switch (jalur) {
      case 'prestasi':
        return 'bg-blue-100 text-blue-800';
      case 'reguler':
        return 'bg-green-100 text-green-800';
      case 'undangan':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getJalurLabel = (jalur: string) => {
    const labels: { [key: string]: string } = {
      prestasi: 'Prestasi',
      reguler: 'Reguler',
      undangan: 'Undangan'
    };
    return labels[jalur] || jalur;
  };

  return (
    <span className={classNames(
      'px-2 py-1 rounded-full text-xs font-medium',
      getJalurColor(jalur)
    )}>
      {getJalurLabel(jalur)}
    </span>
  );
};

// Pindahkan interface ke atas dan export
export interface ExtendedRegistration extends Registration {
  adminStatus?: 'diterima' | 'ditolak';
  jalur: string;
  schoolCategory: SchoolCategory;
}

interface RegistrationTableProps {
  paginatedRegistrations: [string, ExtendedRegistration][];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageCount: number;
  handleStatusChange: (id: string, newStatus: 'approved' | 'rejected' | 'pending') => void;
  openModal: (registration: ExtendedRegistration) => void;
  openDeleteModal: (id: string) => void;
  sortField: string | null;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc' | null;
  setSortDirection: (direction: 'asc' | 'desc' | null) => void;
}

const RegistrationTable: React.FC<RegistrationTableProps> = ({
  paginatedRegistrations,
  currentPage,
  setCurrentPage,
  pageCount,
  handleStatusChange,
  openModal,
  openDeleteModal,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      // Mobile view (Android)
      if (window.innerWidth <= 768) {
        setItemsPerPage(10);
        return;
      }
      // Desktop view - hitung berdasarkan tinggi layar
      const availableHeight = height - 400; // Kurangi header, filter, dll
      const rowHeight = 72; // Tinggi setiap baris
      const calculatedItems = Math.floor(availableHeight / rowHeight);
      // Pastikan minimal 5 item dan maksimal 20 item
      setItemsPerPage(Math.max(5, Math.min(20, calculatedItems)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
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

  // Fungsi untuk render mobile view
  const renderMobileView = () => (
    <div className="block sm:hidden space-y-4">
      {paginatedRegistrations.slice(0, itemsPerPage).map(([id, registration], index) => (
        <div key={id} className="bg-white rounded-lg shadow-sm p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                No. {(currentPage - 1) * 10 + index + 1}
              </p>
              <h3 className="font-medium text-gray-900">
                {registration.teamName ? (
                  <>
                    <span>{registration.teamName}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      PJ: {registration.registrantName}
                    </span>
                  </>
                ) : (
                  registration.name || registration.registrantName || 'N/A'
                )}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {registration.registrationCode}
              </p>
            </div>
            <StatusBadge 
              status={registration.status}
              adminStatus={registration.adminStatus}
              className="text-xs"
            />
          </div>

          {/* Info */}
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Jalur:</span>
              <JalurBadge jalur={registration.jalur} />
            </div>
            <p>Sekolah: {registration.school || 'N/A'}</p>
            <p>Kategori: {registration.schoolCategory}</p>
            <p>Kompetisi: {registration.competition}</p>
            <p>Tanggal: {format(new Date(registration.registrationDate), 'dd/MM/yyyy HH:mm')}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => openModal(registration)}
              className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Detail
            </button>
            <Menu as="div" className="relative flex-1">
              <Menu.Button className="w-full px-3 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1"
                style={{
                  backgroundColor: 
                    registration.status === 'approved' ? '#D1FAE5' :
                    registration.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                  color:
                    registration.status === 'approved' ? '#065F46' :
                    registration.status === 'rejected' ? '#991B1B' : '#92400E'
                }}
              >
                Status
                <FiChevronDown className="w-4 h-4" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-10">
                {['approved', 'rejected', 'pending'].map((status) => (
                  <Menu.Item key={status}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } w-full text-left px-4 py-2 text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg`}
                        onClick={() => handleStatusChange(id, status as any)}
                      >
                        {status === 'approved' ? 'Disetujui' : 
                         status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
            <button
              onClick={() => openDeleteModal(id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {renderMobileView()}
      {/* Desktop view tetap sama */}
      <div className="hidden sm:block">
        <div className="min-w-[1024px]">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th scope="col" className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                <th scope="col" className="w-36 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th scope="col" className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama/Tim</th>
                <th scope="col" className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th scope="col" className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sekolah</th>
                <th scope="col" className="w-36 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kompetisi</th>
                <th scope="col" className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th scope="col" className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRegistrations.slice(0, itemsPerPage).map(([id, registration], index) => (
                <tr key={id} className="hover:bg-gray-50 transition-colors">
                  <td className="h-[72px] px-4 py-3 text-sm text-gray-900">
                    {(currentPage - 1) * 5 + index + 1}
                  </td>
                  <td className="h-[72px] px-4 py-3 text-sm text-gray-900">
                    {registration.registrationCode}
                  </td>
                  <td className="h-[72px] px-4 py-3 text-sm text-gray-900">
                    {format(new Date(registration.registrationDate), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="h-[72px] px-4 py-3 text-sm text-gray-900">
                    {registration.teamName ? (
                      <div>
                        <p className="font-medium line-clamp-1">{registration.teamName}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">PJ: {registration.registrantName}</p>
                      </div>
                    ) : (
                      <p className="line-clamp-2">
                        {registration.name || registration.registrantName || 'N/A'}
                      </p>
                    )}
                  </td>
                  <td className="h-[72px] px-4 py-3 text-sm text-gray-900">
                    <p className="line-clamp-1">{registration.schoolCategory || 'N/A'}</p>
                  </td>
                  <td className="h-[72px] px-4 py-3 text-sm text-gray-900">
                    <p className="line-clamp-2">{registration.school || 'N/A'}</p>
                  </td>
                  <td className="h-[72px] px-4 py-3 text-sm text-gray-900">
                    <p className="line-clamp-2">{registration.competition}</p>
                  </td>
                  <td className="h-[72px] px-4 py-3">
                    <StatusBadge 
                      status={registration.status}
                      adminStatus={registration.adminStatus}
                      className="text-xs whitespace-nowrap"
                    />
                  </td>
                  <td className="h-[72px] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(registration)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
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
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 px-3 py-3 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-700 whitespace-nowrap">
            Menampilkan {Math.min(itemsPerPage, paginatedRegistrations.length)} dari {paginatedRegistrations.length} data
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationTable;