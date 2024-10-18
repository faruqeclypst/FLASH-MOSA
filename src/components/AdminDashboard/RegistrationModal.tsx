import React, { useEffect } from 'react';
import { Registration } from '../../types/index';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface RegistrationModalProps {
  registration: Registration;
  onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ registration, onClose }) => {
  const isTeam = !!registration.teamName || (registration.teamMembers && registration.teamMembers.length > 0);

  useEffect(() => {
    // Disable scrolling on the body when the modal is opened
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when the modal is closed
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const renderRegistrationDetails = (registration: Registration) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col relative">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Detail Pendaftaran</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-300"
              aria-label="Tutup"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-grow">
            {renderRegistrationDetails(registration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;