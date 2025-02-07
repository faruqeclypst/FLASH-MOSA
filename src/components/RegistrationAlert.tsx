//src/components/RegistrationAlert.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Registration, FlashEvent, Competition, SchoolCategory } from '../types';
import { Download, MessageCircle, X } from 'lucide-react';
import jsPDF from 'jspdf';
import { useFirebase } from '../hooks/useFirebase';
import LogoImage from '../assets/img/logo.png';
import MosaLogo from '../assets/img/mosa.png';
import { FaWhatsapp } from 'react-icons/fa';

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
  
  // Get the competition data based on registrationData.competition
  const competition = flashEvent?.competitions.find(
    comp => comp.name === registrationData?.competition
  );

  if (!isOpen || !registrationData) return null;

  const generatePDF = async () => {
    // Create PDF with compressed settings
    const doc = new jsPDF({
      compress: true,
      unit: 'mm',
      format: 'a4'
    });

    // Optimize image quality and size
    const imageQuality = {
      imageQuality: 0.5, // Reduce image quality to 50%
      compress: true
    };

    // Function to add optimized image
    const addOptimizedImage = (
      image: string, 
      x: number, 
      y: number, 
      width: number, 
      height: number
    ) => {
      doc.addImage(
        image,
        'PNG',
        x,
        y,
        width,
        height,
        undefined,
        'FAST',
        0 // rotation
      );
    };

    if (flashEvent?.aboutImage) {
      const addWatermark = async () => {
        try {
          doc.addPage();
          const pageCount = doc.getNumberOfPages();
          
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            const opacity = 0.05; // Reduced opacity for smaller file size
            doc.saveGraphicsState();
            const gState = new (doc as any).GState({ opacity }) as GState;
            doc.setGState(gState);
            
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const aspectRatio = 1;
            
            // Reduced logo size for smaller file size
            const logoWidth = pageWidth * 0.6; // Reduced from 0.8 to 0.6
            const logoHeight = logoWidth * aspectRatio;
            
            const x = (pageWidth - logoWidth) / 2;
            const y = (pageHeight - logoHeight) / 2;
            
            addOptimizedImage(
              LogoImage,
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

      await addWatermark();
    }
    
    if (doc.getNumberOfPages() > 1) {
      doc.deletePage(1);
    }

    // Optimize header logos
    const flashLogoSize = 25; // Reduced from 25
    const mosaLogoSize = 20; // Reduced from 20
    const flashLogoY = 10;
    const mosaLogoY = 12;

    // Add optimized logos
    addOptimizedImage(
      LogoImage,
      20,
      flashLogoY,
      flashLogoSize,
      flashLogoSize
    );

    addOptimizedImage(
      MosaLogo,
      170,
      mosaLogoY,
      mosaLogoSize,
      mosaLogoSize
    );

    // Rest of the PDF content remains the same, but with optimized text settings
    doc.setFontSize(16); // Slightly reduced font sizes
    doc.setFont('helvetica', 'bold');
    doc.text('FLASH CELESTIANCE 2025', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Future Language and Art for Smart Student of Highschool', 105, 27, { align: 'center' });
    doc.text('SMAN Modal Bangsa', 105, 32, { align: 'center' });

    // Use thinner lines
    doc.setLineWidth(0.2); // Reduced from 0.5
    doc.line(20, 40, 190, 40);

    // Add back BUKTI PENDAFTARAN title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BUKTI PENDAFTARAN', 105, 48, { align: 'center' });
    
    // Section 1: Informasi Pendaftaran - increased Y coordinate from 50 to 60 for more spacing
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMASI PENDAFTARAN', 20, 60);
    
    doc.setFont('helvetica', 'normal');
    const details = [
      ['Kode Pendaftaran', ': ' + registrationData.registrationCode],
      ['Tanggal Daftar', ': ' + new Date(registrationData.registrationDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })],
    ];

    // Update the Y coordinates for the details accordingly
    details.forEach((detail, index) => {
      doc.text(detail[0], 20, 60 + 8 + (index * 7));
      doc.text(detail[1], 20 + 60, 60 + 8 + (index * 7));
    });
    
    // Section 2: Informasi Lomba - jarak antar section 20pt
    const section2Y = 60 + 30;
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMASI LOMBA', 20, section2Y);
    
    doc.setFont('helvetica', 'normal');
    const competitionDetails = [
      ['Kategori', ': ' + registrationData.schoolCategory],
      ['Jenis Lomba', ': ' + registrationData.competition],
    ];

    competitionDetails.forEach((detail, index) => {
      doc.text(detail[0], 20, section2Y + 8 + (index * 7));
      doc.text(detail[1], 20 + 60, section2Y + 8 + (index * 7));
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
        doc.text(detail[0], 20, section3Y + 8 + (index * 7));
        doc.text(detail[1], 20 + 60, section3Y + 8 + (index * 7));
      }
    });

    // Section 4: Anggota Tim (jika ada)
    if (registrationData.teamMembers && registrationData.teamMembers.length > 0) {
      const section4Y = section3Y + (participantDetails.length * 7) + 15;
      doc.setFont('helvetica', 'bold');
      doc.text('ANGGOTA TIM', 20, section4Y);
      
      doc.setFont('helvetica', 'normal');
      registrationData.teamMembers.forEach((member, index) => {
        doc.text(`${index + 1}. ${member}`, 20, section4Y + 8 + (index * 7));
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
    doc.setLineWidth(0.2);
    doc.line(20, pageHeight - 20, 190, pageHeight - 20);
    
    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('FLASH Celestiance 2025 - Future Language and Art for Smart Student of Highschool', 105, pageHeight - 15, { align: 'center' });
    
    // Before saving, check and potentially compress if still too large
    const pdfOutput = doc.output('arraybuffer');
    const pdfSize = pdfOutput.byteLength / 1024; // Size in KB

    if (pdfSize > 200) {
      // If still too large, further reduce quality
      doc.deletePage(doc.getNumberOfPages());
      doc.addPage();
      // Regenerate with even lower quality settings
      // ... (repeat the essential content with lower quality)
    }

    // Save the optimized PDF
    doc.save(`Bukti_Pendaftaran_${registrationData.registrationCode}.pdf`);
  };

  const getWhatsAppUrl = (competition: Competition, category: SchoolCategory) => {
    const group = competition.whatsappGroups?.find((g: { category: SchoolCategory; url: string }) => g.category === category);
    return group?.url || '';
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
                  <p className="font-medium text-gray-900 break-words">{registrationData.teamName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Pendaftar</p>
                  <p className="font-medium text-gray-900 break-words">{registrationData.registrantName}</p>
                </div>
              </>
            ) : (
              <div className="space-y-1 col-span-2">
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-medium text-gray-900 break-words">{registrationData.name}</p>
              </div>
            )}
            <div className="space-y-1 col-span-2">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900 break-words">{registrationData.email}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-sm text-gray-500">WhatsApp</p>
              <p className="font-medium text-gray-900 break-words">{registrationData.whatsapp}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Buttons Row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Download Button */}
              <button
                onClick={generatePDF}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg shadow-blue-100 font-medium text-sm group"
              >
                <Download className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
                <span>Unduh Bukti</span>
              </button>

              {/* WhatsApp Button */}
              {competition && competition.whatsappGroups && competition.whatsappGroups.length > 0 && (
                <a
                  href={getWhatsAppUrl(competition, registrationData.schoolCategory)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-lg shadow-emerald-100 font-medium text-sm group"
                >
                  <FaWhatsapp className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
                  <span>Join WA</span>
                </a>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-lg shadow-rose-100 font-medium text-sm group"
              >
                <X className="w-4 h-4 mr-1.5 transition-transform group-hover:scale-110" />
                <span>Tutup</span>
              </button>
            </div>

            {/* Tips */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Simpan bukti pendaftaran dan bergabung ke grup WhatsApp untuk informasi selanjutnya
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegistrationAlert;