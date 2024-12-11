import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../hooks/useFirebase';
import { Registration } from '../../types';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import { format } from 'date-fns';
import { 
  EyeIcon, 
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  TrophyIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import DeleteModal from './DeleteModal';
import { showAlert } from '../ui/Alert';
import Pagination from '../ui/Pagination';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import classNames from 'classnames';

const RegistrationData: React.FC = () => {
  const { data: registrations, updateData, deleteData } = useFirebase<Record<string, Registration>>('registrations');
  const [selectedRegistration, setSelectedRegistration] = useState<(Registration & { id: string }) | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const itemsPerPage = 10;

  const filteredRegistrations = Object.entries(registrations || {}).filter(([_, registration]) => {
    const matchesSearch = 
      registration.registrationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.competition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === registration.status;

    return matchesSearch && matchesStatus;
  });

  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      if (!registrations || !registrations[id]) {
        throw new Error('Data registrasi tidak ditemukan');
      }

      const updatedRegistration = {
        ...registrations[id],
        status: newStatus
      };

      await updateData({ [id]: updatedRegistration });

      setSelectedRegistration({ ...updatedRegistration, id });

      showAlert(
        newStatus === 'approved' ? 'success' : 'error',
        `Status pendaftaran berhasil diubah menjadi ${
          newStatus === 'approved' ? 'diterima' : 'ditolak'
        }`
      );
    } catch (error) {
      console.error('Error updating status:', error);
      showAlert('error', 'Gagal mengubah status pendaftaran');
    }
  };

  const handleDelete = async () => {
    if (!selectedRegistration) return;
    
    try {
      setIsClosing(true);
      
      // Tunggu animasi closing selesai
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('Deleting registration:', selectedRegistration.registrationCode);
      await deleteData(selectedRegistration.registrationCode);
      
      setSelectedRegistration(null);
      setIsDeleteModalOpen(false);
      showAlert('success', 'Pendaftaran berhasil dihapus');
      
    } catch (error) {
      console.error('Error deleting registration:', error);
      showAlert('error', 'Gagal menghapus pendaftaran');
    } finally {
      setIsClosing(false);
    }
  };

  const columns = [
    { header: 'Kode Pendaftaran', width: '150px' },
    { header: 'Nama/Tim', width: '200px' },
    { header: 'Kompetisi', width: '150px' },
    { header: 'Kategori', width: '120px' },
    { header: 'Tanggal Daftar', width: '150px' },
    { header: 'Status', width: '120px' },
    { header: 'Aksi', width: '150px' }
  ];

  const renderRegistrationDetail = (registration: Registration) => {
    return (
      <div className="space-y-6">
        {/* Status Badge - Ditambahkan di bagian atas */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              registration.status === 'approved' ? 'bg-green-100' :
              registration.status === 'rejected' ? 'bg-red-100' :
              'bg-yellow-100'
            }`}>
              {registration.status === 'approved' && <CheckCircleIcon className="w-6 h-6 text-green-600" />}
              {registration.status === 'rejected' && <XCircleIcon className="w-6 h-6 text-red-600" />}
              {registration.status === 'pending' && <ClockIcon className="w-6 h-6 text-yellow-600" />}
            </div>
            <div>
              <p className="text-sm text-gray-500">Status Pendaftaran</p>
              <p className={`font-medium ${
                registration.status === 'approved' ? 'text-green-600' :
                registration.status === 'rejected' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {registration.status === 'approved' ? 'Diterima' :
                 registration.status === 'rejected' ? 'Ditolak' : 
                 'Menunggu Verifikasi'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Kode Pendaftaran</p>
            <p className="font-mono font-medium text-gray-900">{registration.registrationCode}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Informasi Kompetisi - Diperbarui */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-blue-600" />
            Informasi Kompetisi
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-500">Kompetisi</p>
              <p className="font-medium text-gray-900">{registration.competition}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-500">Kategori</p>
              <p className="font-medium text-gray-900">{registration.schoolCategory}</p>
            </div>
          </div>
        </div>

        {/* Informasi Tim/Individu - Diperbarui */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-medium text-indigo-900 mb-3 flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 text-indigo-600" />
            {registration.teamName ? 'Informasi Tim' : 'Informasi Peserta'}
          </h4>
          {registration.teamName ? (
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-500">Nama Tim</p>
                <p className="font-medium text-gray-900">{registration.teamName}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Anggota Tim</p>
                <div className="space-y-2">
                  {registration.teamMembers?.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-900">
                      <UserIcon className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-500">Nama Lengkap</p>
                <p className="font-medium text-gray-900">{registration.name}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-500">Jenis Kelamin</p>
                <p className="font-medium text-gray-900">{registration.gender}</p>
              </div>
              <div className="bg-white p-3 rounded-lg col-span-2">
                <p className="text-sm text-gray-500">Tanggal Lahir</p>
                <p className="font-medium text-gray-900">
                  {registration.birthDate ? format(new Date(registration.birthDate), 'dd MMMM yyyy') : '-'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Informasi Kontak - Diperbarui */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
            <PhoneIcon className="w-5 h-5 text-purple-600" />
            Informasi Kontak
          </h4>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-500">Email</p>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4 text-purple-500" />
                <p className="font-medium text-gray-900">{registration.email}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-500">WhatsApp</p>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-purple-500" />
                <p className="font-medium text-gray-900">{registration.whatsapp}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-sm text-gray-500">Kota</p>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-purple-500" />
                <p className="font-medium text-gray-900">{registration.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dokumen - Diperbarui */}
        {(registration.ktsSuratAktif || registration.buktiPembayaran) && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-green-600" />
              Dokumen Pendaftaran
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {registration.ktsSuratAktif && (
                <a
                  href={registration.ktsSuratAktif}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-green-50 transition-colors group"
                >
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200">
                    <DocumentArrowDownIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">KTS/Surat Aktif</p>
                    <p className="text-sm text-green-600">Klik untuk mengunduh</p>
                  </div>
                </a>
              )}
              {registration.buktiPembayaran && (
                <a
                  href={registration.buktiPembayaran}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-green-50 transition-colors group"
                >
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200">
                    <DocumentArrowDownIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Bukti Pembayaran</p>
                    <p className="text-sm text-green-600">Klik untuk mengunduh</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTableActions = (id: string, registration: Registration) => (
    <div className="flex gap-2">
      <button 
        onClick={() => {
          setSelectedRegistration({ ...registration, id });
          setShowDetailModal(true);
        }}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
        title="Lihat Detail"
      >
        <EyeIcon className="w-5 h-5" />
      </button>
      <button 
        onClick={() => handleStatusChange(id, 'approved')}
        className="p-1 text-green-600 hover:bg-green-50 rounded"
        title="Terima"
      >
        <CheckCircleIcon className="w-5 h-5" />
      </button>
      <button 
        onClick={() => handleStatusChange(id, 'rejected')}
        className="p-1 text-red-600 hover:bg-red-50 rounded"
        title="Tolak"
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
      <button 
        onClick={() => {
          setSelectedRegistration({ ...registration, id });
          setIsDeleteModalOpen(true);
        }}
        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
        title="Hapus"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );

  const getFilteredData = () => {
    return Object.entries(registrations || {}).filter(([_, registration]) => {
      const matchesSearch = 
        registration.registrationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.competition.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === registration.status;

      return matchesSearch && matchesStatus;
    }).map(([id, registration]) => ({
      id,
      ...registration
    }));
  };

  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Pendaftar');

      // Definisikan kolom
      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Kode Pendaftaran', key: 'registrationCode', width: 20 },
        { header: 'Nama/Tim', key: 'name', width: 30 },
        { header: 'Anggota Tim', key: 'teamMembers', width: 40 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'WhatsApp', key: 'whatsapp', width: 15 },
        { header: 'Jenis Kelamin', key: 'gender', width: 15 },
        { header: 'Tanggal Lahir', key: 'birthDate', width: 15 },
        { header: 'Kota', key: 'city', width: 20 },
        { header: 'Kompetisi', key: 'competition', width: 20 },
        { header: 'Kategori', key: 'category', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Tanggal Daftar', key: 'registrationDate', width: 20 },
        { header: 'KTS/Surat Aktif', key: 'ktsSuratAktif', width: 50 },
        { header: 'Bukti Pembayaran', key: 'buktiPembayaran', width: 50 }
      ];

      // Style untuk header
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4B5563' }
        };
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFF' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      // Tambahkan data
      const data = getFilteredData().map((item: Registration & { id: string }, index: number) => ({
        no: index + 1,
        registrationCode: item.registrationCode,
        name: item.teamName || item.name,
        teamMembers: item.teamMembers ? item.teamMembers.join(', ') : '-',
        email: item.email,
        whatsapp: item.whatsapp,
        gender: item.gender === 'Laki-laki' ? 'Laki-laki' : 
                item.gender === 'Perempuan' ? 'Perempuan' : '-',
        birthDate: item.birthDate ? format(new Date(item.birthDate), 'dd/MM/yyyy') : '-',
        city: item.city,
        competition: item.competition,
        category: item.schoolCategory,
        status: item.status === 'approved' ? 'Diterima' : 
                item.status === 'rejected' ? 'Ditolak' : 'Pending',
        registrationDate: format(new Date(item.registrationDate), 'dd/MM/yyyy HH:mm'),
        ktsSuratAktif: item.ktsSuratAktif ? {
          text: 'Klik disini',
          hyperlink: item.ktsSuratAktif,
          tooltip: 'Klik untuk melihat dokumen'
        } : '-',
        buktiPembayaran: item.buktiPembayaran ? {
          text: 'Klik disini',
          hyperlink: item.buktiPembayaran,
          tooltip: 'Klik untuk melihat dokumen'
        } : '-'
      }));

      worksheet.addRows(data);

      // Style untuk setiap cell
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header
          row.eachCell((cell, colNumber) => {
            // Border untuk semua cell
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };

            // Alignment untuk kolom tertentu
            if ([1, 6, 7, 8, 12].includes(colNumber)) { // No, WhatsApp, Gender, Birth Date, Status
              cell.alignment = { horizontal: 'center' };
            }
            
            // Style khusus untuk status
            if (colNumber === 12) { // Kolom status
              const status = cell.value as string;
              if (status === 'Diterima') {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'DCFCE7' }
                };
                cell.font = { color: { argb: '166534' } };
              } else if (status === 'Ditolak') {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FEE2E2' }
                };
                cell.font = { color: { argb: 'B91C1C' } };
              } else {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FEF3C7' }
                };
                cell.font = { color: { argb: 'B45309' } };
              }
            }

            // Style untuk link dokumen
            if (colNumber === 14 || colNumber === 15) { // Kolom dokumen
              if (cell.value !== '-') {
                cell.font = {
                  color: { argb: '2563EB' },
                  underline: true
                };
                cell.alignment = { horizontal: 'center' };
                // Tambahkan hyperlink
                const value = cell.value as { text: string; hyperlink: string; tooltip: string };
                cell.value = {
                  text: value.text,
                  hyperlink: value.hyperlink,
                  tooltip: value.tooltip
                };
              } else {
                cell.alignment = { horizontal: 'center' };
              }
            }
          });
        }
      });

      // Freeze pane
      worksheet.views = [
        { state: 'frozen', xSplit: 3, ySplit: 1 }
      ];

      // Auto filter
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: worksheet.columns.length }
      };

      // Generate file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Download file
      saveAs(blob, `Data_Pendaftar_FLASH_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.xlsx`);
      
      showAlert('success', 'Data berhasil diexport ke Excel');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      showAlert('error', 'Gagal mengexport data ke Excel');
    }
  };

  const StatusModal = ({ isOpen, onClose, onConfirm, registration }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (status: 'approved' | 'rejected') => void;
    registration: Registration | null;
  }) => {
    if (!registration) return null;

    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 200);
    };

    const handleConfirm = (status: 'approved' | 'rejected') => {
      onConfirm(status);
      handleClose();
    };

    return (
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose}
        size="sm"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status Pendaftaran</h3>
          <p className="text-gray-600 mb-6">
            Pilih status untuk pendaftaran {registration.teamName || registration.name}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => handleConfirm('approved')}
              className="w-full flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <CheckCircleIcon className="w-5 h-5" />
              <span>Terima Pendaftaran</span>
            </button>
            <button
              onClick={() => handleConfirm('rejected')}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <XCircleIcon className="w-5 h-5" />
              <span>Tolak Pendaftaran</span>
            </button>
            <button
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Tutup</span>
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Pendaftaran</h1>
          <p className="text-gray-600 mt-1">Kelola semua data pendaftaran peserta FLASH</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <UserGroupIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-lg font-semibold text-gray-900">{filteredRegistrations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <ClockIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredRegistrations.filter(([_, r]) => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Diterima</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredRegistrations.filter(([_, r]) => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredRegistrations.filter(([_, r]) => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, kode, atau kompetisi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Diterima</option>
              <option value="rejected">Ditolak</option>
            </select>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table/List View Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table
            columns={columns}
            data={paginatedRegistrations.map(([id, registration]) => [
              registration.registrationCode,
              registration.teamName || registration.name,
              registration.competition,
              registration.schoolCategory,
              format(new Date(registration.registrationDate), 'dd/MM/yyyy HH:mm'),
              <span className={`px-2 py-1 rounded-full text-sm ${
                registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                registration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {registration.status}
              </span>,
              renderTableActions(id, registration)
            ])}
          />
        </div>

        {/* Mobile Dropdown View */}
        <div className="md:hidden">
          {getFilteredData().map((registration) => (
            <div key={registration.registrationCode} className="border-b last:border-b-0">
              <div 
                onClick={() => setExpandedRow(expandedRow === registration.registrationCode ? null : registration.registrationCode)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {registration.teamName || registration.name}
                    </span>
                    <span className={classNames(
                      'px-2 py-0.5 rounded-full text-xs',
                      registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                      registration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    )}>
                      {registration.status === 'approved' ? 'Diterima' :
                       registration.status === 'rejected' ? 'Ditolak' : 
                       'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500">{registration.registrationCode}</p>
                    <p className="text-xs text-gray-500">{registration.competition}</p>
                  </div>
                </div>
                <ChevronDownIcon 
                  className={classNames(
                    'w-5 h-5 text-gray-400 transition-transform duration-200',
                    expandedRow === registration.registrationCode ? 'rotate-180' : ''
                  )}
                />
              </div>

              {expandedRow === registration.registrationCode && (
                <div className="px-4 pb-4 space-y-4 bg-gray-50/50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Kategori</p>
                      <p className="text-sm text-gray-900">{registration.schoolCategory}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tanggal Daftar</p>
                      <p className="text-sm text-gray-900">
                        {format(new Date(registration.registrationDate), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRegistration({ 
                          ...registration, 
                          id: registration.id
                        });
                        setShowDetailModal(true);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Detail
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(registration.id, 'approved');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-green-50 text-green-600 rounded-lg text-xs font-medium"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Terima
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(registration.id, 'rejected');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium"
                    >
                      <XCircleIcon className="w-4 h-4" />
                      Tolak
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRegistrations.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* Detail Modal - Update tampilan */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        size="xl"
      >
        <div className="relative">
          {/* Header Modal */}
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Detail Pendaftaran</h3>
              <div className="text-right">
                <p className="text-xs text-gray-500">Kode Pendaftaran</p>
                <p className="font-mono font-medium text-gray-900">{selectedRegistration?.registrationCode}</p>
              </div>
            </div>
          </div>

          {/* Content Modal */}
          <div className="p-6">
            {selectedRegistration && (
              <div className="grid grid-cols-12 gap-6">
                {/* Kolom Kiri */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  {/* Status Badge */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        selectedRegistration.status === 'approved' ? 'bg-green-100' :
                        selectedRegistration.status === 'rejected' ? 'bg-red-100' :
                        'bg-yellow-100'
                      }`}>
                        {selectedRegistration.status === 'approved' && <CheckCircleIcon className="w-6 h-6 text-green-600" />}
                        {selectedRegistration.status === 'rejected' && <XCircleIcon className="w-6 h-6 text-red-600" />}
                        {selectedRegistration.status === 'pending' && <ClockIcon className="w-6 h-6 text-yellow-600" />}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status Pendaftaran</p>
                        <p className={`font-medium ${
                          selectedRegistration.status === 'approved' ? 'text-green-600' :
                          selectedRegistration.status === 'rejected' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {selectedRegistration.status === 'approved' ? 'Diterima' :
                           selectedRegistration.status === 'rejected' ? 'Ditolak' : 
                           'Menunggu Verifikasi'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informasi Kompetisi */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <TrophyIcon className="w-5 h-5 text-blue-600" />
                      Informasi Kompetisi
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Kompetisi</p>
                        <p className="font-medium text-gray-900">{selectedRegistration.competition}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Kategori</p>
                        <p className="font-medium text-gray-900">{selectedRegistration.schoolCategory}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dokumen */}
                  {(selectedRegistration.ktsSuratAktif || selectedRegistration.buktiPembayaran) && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-green-600" />
                        Dokumen Pendaftaran
                      </h4>
                      <div className="space-y-3">
                        {selectedRegistration.ktsSuratAktif && (
                          <a
                            href={selectedRegistration.ktsSuratAktif}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-green-50 transition-colors group"
                          >
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200">
                              <DocumentArrowDownIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-green-900">KTS/Surat Aktif</p>
                              <p className="text-sm text-green-600">Klik untuk mengunduh</p>
                            </div>
                          </a>
                        )}
                        {selectedRegistration.buktiPembayaran && (
                          <a
                            href={selectedRegistration.buktiPembayaran}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-green-50 transition-colors group"
                          >
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200">
                              <DocumentArrowDownIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-green-900">Bukti Pembayaran</p>
                              <p className="text-sm text-green-600">Klik untuk mengunduh</p>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Kolom Kanan */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  {/* Informasi Tim/Individu */}
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-900 mb-3 flex items-center gap-2">
                      <UserGroupIcon className="w-5 h-5 text-indigo-600" />
                      {selectedRegistration.teamName ? 'Informasi Tim' : 'Informasi Peserta'}
                    </h4>
                    {selectedRegistration.teamName ? (
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Nama Tim</p>
                          <p className="font-medium text-gray-900">{selectedRegistration.teamName}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">Anggota Tim</p>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedRegistration.teamMembers?.map((member, index) => (
                              <div 
                                key={index} 
                                className="flex items-center gap-2 text-gray-900 bg-indigo-50/50 px-3 py-1.5 rounded-lg"
                              >
                                <UserIcon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                <span className="font-medium text-sm truncate">{member}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Nama Lengkap</p>
                          <p className="font-medium text-gray-900">{selectedRegistration.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Jenis Kelamin</p>
                            <p className="font-medium text-gray-900">{selectedRegistration.gender}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Tanggal Lahir</p>
                            <p className="font-medium text-gray-900">
                              {selectedRegistration.birthDate ? format(new Date(selectedRegistration.birthDate), 'dd MMMM yyyy') : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Informasi Kontak */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                      <PhoneIcon className="w-5 h-5 text-purple-600" />
                      Informasi Kontak
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Email</p>
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="w-4 h-4 text-purple-500" />
                          <p className="font-medium text-gray-900">{selectedRegistration.email}</p>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-500">WhatsApp</p>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="w-4 h-4 text-purple-500" />
                          <p className="font-medium text-gray-900">{selectedRegistration.whatsapp}</p>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Kota</p>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4 text-purple-500" />
                          <p className="font-medium text-gray-900">{selectedRegistration.city}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Modal */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
            <button
              onClick={() => setShowDetailModal(false)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Status
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal tetap sama */}
      <DeleteModal
        isOpen={isDeleteModalOpen && !isClosing}
        onClose={() => {
          setIsClosing(true);
          setTimeout(() => {
            setIsDeleteModalOpen(false);
            setSelectedRegistration(null);
            setIsClosing(false);
          }, 200);
        }}
        onConfirm={handleDelete}
        itemName="pendaftaran"
        registrationCode={selectedRegistration?.registrationCode}
        nameOrTeam={selectedRegistration?.teamName || selectedRegistration?.name}
      />

      <StatusModal
        isOpen={showStatusModal && !isClosing}
        onClose={() => setShowStatusModal(false)}
        onConfirm={(status) => {
          if (selectedRegistration) {
            handleStatusChange(selectedRegistration.id, status);
            setShowStatusModal(false);
          }
        }}
        registration={selectedRegistration}
      />
    </div>
  );
};

export default RegistrationData; 