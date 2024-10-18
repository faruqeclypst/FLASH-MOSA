import React from 'react';
import { Tab } from '@headlessui/react';
import { Registration } from '../../types/index';
import { format } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown, FiChevronDown } from 'react-icons/fi';
import { Menu } from '@headlessui/react';

interface RegistrationTableProps {
  paginatedRegistrations: [string, Registration][];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageCount: number;
  handleStatusChange: (id: string, newStatus: 'approved' | 'rejected' | 'pending') => void;
  openModal: (registration: Registration) => void;
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

  return (
    <Tab.Group>
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
                        <td className="p-3">{(currentPage - 1) * 5 + index + 1}</td>
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
              </tbody>
            </table>
            {paginatedRegistrations.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  <FiChevronLeft />
                </button>
                <span>
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, pageCount))}
                  disabled={currentPage === pageCount}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default RegistrationTable;