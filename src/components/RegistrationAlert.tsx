//src/components/RegistrationAlert.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Registration } from '../types';
import { Download, MessageCircle, X } from 'lucide-react';
import jsPDF from 'jspdf';
import { FlashEvent } from '../types';
import { useFirebase } from '../hooks/useFirebase';
import LogoImage from '../assets/img/logo.png';
import MosaLogo from '../assets/img/mosa.png';

interface RegistrationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  registrationData?: Registration;
}

// Add type definition for GState
interface GState {
  opacity: number;
}

const RegistrationAlert: React.FC<RegistrationAlertProps> = ({ isOpen, onClose, registrationData }) => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  
  if (!isOpen || !registrationData) return null;

  const generatePDF = async () => {
    const doc = new jsPDF();
    
    if (flashEvent?.aboutImage) {
      // Update the addWatermark function
      const addWatermark = async () => {
        try {
          doc.addPage();
          const pageCount = doc.getNumberOfPages();
          
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            const opacity = 0.1;
            doc.saveGraphicsState();
            // Use type assertion to handle jsPDF's GState
            const gState = new (doc as any).GState({ opacity }) as GState;
            doc.setGState(gState);
            
            // Calculate dimensions while maintaining aspect ratio
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const aspectRatio = 1; // Assuming logo is square, adjust if needed
            
            // Calculate size to fit width while maintaining aspect ratio
            const logoWidth = pageWidth * 0.8; // 80% of page width
            const logoHeight = logoWidth * aspectRatio;
            
            // Center the logo
            const x = (pageWidth - logoWidth) / 2;
            const y = (pageHeight - logoHeight) / 2;
            
            doc.addImage(
              LogoImage,
              'PNG',
              x,
              y,
              logoWidth,
              logoHeight
            );
            
            doc.restoreGraphicsState();
          }
          return true;
        } catch (error) {
          console.error('Error adding watermark:', error);
        }
      };

      // Tunggu watermark selesai ditambahkan
      await addWatermark();
    }
    
    // Hapus halaman kosong yang mungkin ditambahkan
    if (doc.getNumberOfPages() > 1) {
      doc.deletePage(1);
    }

    // Add logos to header with different sizes and positions
    const flashLogoSize = 25; // Bigger size for Flash logo
    const mosaLogoSize = 20; // Keep original size for MOSA logo
    const flashLogoY = 10;   // Y position for Flash logo
    const mosaLogoY = 12;    // Lower Y position for MOSA logo

    // Add Flash logo on the left (bigger)
    doc.addImage(
      LogoImage,
      'PNG',
      20,
      flashLogoY,
      flashLogoSize,
      flashLogoSize
    );

    // Add MOSA logo on the right (original size)
    doc.addImage(
      MosaLogo,
      'PNG',
      170,
      mosaLogoY,  // Using lower Y position for MOSA logo
      mosaLogoSize,
      mosaLogoSize
    );

    // Center title text
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FLASH CELESTIANCE 2025', 105, 20, { align: 'center' });

    // Subtitle text in two lines
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Future Language and Art for Smart Student of Highschool', 105, 27, { align: 'center' });
    doc.text('SMAN Modal Bangsa', 105, 32, { align: 'center' });

    // Adjust separator line position
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    // Adjust registration proof title position
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BUKTI PENDAFTARAN', 105, 48, { align: 'center' });
    
    // Informasi pendaftaran - mulai lebih awal
    const startY = 50;
    const colWidth = 60;
    const lineHeight = 7; // Kurangi line height
    
    // Section 1: Informasi Pendaftaran
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMASI PENDAFTARAN', 20, startY);
    
    doc.setFont('helvetica', 'normal');
    const details = [
      ['Kode Pendaftaran', ': ' + registrationData.registrationCode],
      ['Tanggal Daftar', ': ' + new Date(registrationData.registrationDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })],
    ];

    details.forEach((detail, index) => {
      doc.text(detail[0], 20, startY + 8 + (index * lineHeight));
      doc.text(detail[1], 20 + colWidth, startY + 8 + (index * lineHeight));
    });
    
    // Section 2: Informasi Lomba - jarak antar section 20pt
    const section2Y = startY + 30;
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMASI LOMBA', 20, section2Y);
    
    doc.setFont('helvetica', 'normal');
    const competitionDetails = [
      ['Kategori', ': ' + registrationData.schoolCategory],
      ['Jenis Lomba', ': ' + registrationData.competition],
    ];

    competitionDetails.forEach((detail, index) => {
      doc.text(detail[0], 20, section2Y + 8 + (index * lineHeight));
      doc.text(detail[1], 20 + colWidth, section2Y + 8 + (index * lineHeight));
    });
    
    // Section 3: Informasi Peserta
    const section3Y = section2Y + 30;
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMASI PESERTA', 20, section3Y);
    
    doc.setFont('helvetica', 'normal');
    const participantDetails = [
      ['Nama', ': ' + (registrationData.teamName ? registrationData.teamName : registrationData.name)],
      registrationData.teamName ? ['Pendaftar', ': ' + registrationData.registrantName] : null,
      ['Email', ': ' + registrationData.email],
      ['WhatsApp', ': ' + registrationData.whatsapp],
      registrationData.school ? ['Sekolah', ': ' + registrationData.school] : null,
      ['Kota', ': ' + registrationData.city],
    ].filter(detail => detail !== null);

    participantDetails.forEach((detail, index) => {
      if (detail) {
        doc.text(detail[0], 20, section3Y + 8 + (index * lineHeight));
        doc.text(detail[1], 20 + colWidth, section3Y + 8 + (index * lineHeight));
      }
    });

    // Section 4: Anggota Tim (jika ada)
    if (registrationData.teamMembers && registrationData.teamMembers.length > 0) {
      const section4Y = section3Y + (participantDetails.length * lineHeight) + 15;
      doc.setFont('helvetica', 'bold');
      doc.text('ANGGOTA TIM', 20, section4Y);
      
      doc.setFont('helvetica', 'normal');
      registrationData.teamMembers.forEach((member, index) => {
        doc.text(`${index + 1}. ${member}`, 20, section4Y + 8 + (index * lineHeight));
      });
    }
    
    // Footer - posisi tetap dari bawah
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Catatan:', 20, pageHeight - 45);
    doc.text('1. Dokumen ini sebagai bukti pendaftaran FLASH Celestiance', 25, pageHeight - 40);
    doc.text('2. Status pendaftaran akan diverifikasi oleh panitia dalam waktu periode pendaftaran FLASH Celestiance', 25, pageHeight - 35);
    doc.text('3. Informasi lebih lanjut akan dikirimkan melalui WhatsApp / email yang telah didaftarkan', 25, pageHeight - 30);
    
    // Garis footer
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 20, 190, pageHeight - 20);
    
    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('FLASH Celestiance 2025 - Future Language and Art for Smart Student of Highschool', 105, pageHeight - 15, { align: 'center' });
    
    // Simpan PDF
    doc.save(`Bukti_Pendaftaran_${registrationData.registrationCode}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header Section dengan Background */}
        <div className="bg-gradient-to-r from-emerald-900 to-purple-900 p-6 text-white">
          <div className="flex items-center justify-center">
            <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white font-antistar">Pendaftaran Berhasil!</h2>
          <p className="text-center text-white/80 mt-1 font-inter">Selamat bergabung di FLASH Celestiance 2025</p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Registration Code Card */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-green-800 font-medium font-inter">Kode Pendaftaran</p>
              <p className="text-xl font-bold text-blue-700 mt-1 font-inter">{registrationData.registrationCode}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Kategori</p>
              <p className="font-medium text-gray-900">{registrationData.schoolCategory}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Lomba</p>
              <p className="font-medium text-gray-900">{registrationData.competition}</p>
            </div>
            {registrationData.teamName ? (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Nama Tim</p>
                  <p className="font-medium text-gray-900">{registrationData.teamName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Pendaftar</p>
                  <p className="font-medium text-gray-900">{registrationData.registrantName}</p>
                </div>
              </>
            ) : (
              <div className="space-y-1 col-span-2">
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-medium text-gray-900">{registrationData.name}</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{registrationData.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">WhatsApp</p>
              <p className="font-medium text-gray-900">{registrationData.whatsapp}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={generatePDF}
                className="bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                <Download size={20} />
                <span>Unduh Bukti</span>
              </button>
              
              <a
                href="https://chat.whatsapp.com/Aw041w6OcwvCL5pbf0YTJa"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white py-3 px-6 rounded-xl hover:bg-emerald-700 transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
              >
                <MessageCircle size={20} />
                <span>Group Flash</span>
              </a>

              <button
                onClick={onClose}
                className="bg-rose-600 text-white py-3 px-6 rounded-xl hover:bg-rose-700 transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-rose-100"
              >
                <X size={20} />
                <span>Tutup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegistrationAlert;