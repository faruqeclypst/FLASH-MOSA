//src/components/RegistrationAlert.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Registration } from '../types';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface RegistrationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  registrationData?: Registration;
}

const RegistrationAlert: React.FC<RegistrationAlertProps> = ({ isOpen, onClose, registrationData }) => {
  if (!isOpen || !registrationData) return null;

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header text dengan posisi yang disesuaikan karena tidak ada logo
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FLASH Competition 2024', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Festival of Technology, Art and Science', 105, 27, { align: 'center' });
    
    // Garis pemisah
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Judul bukti pendaftaran
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BUKTI PENDAFTARAN', 105, 45, { align: 'center' });
    
    // Informasi pendaftaran
    const startY = 60;
    const colWidth = 60;
    const lineHeight = 8;
    
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
      ['Status', ': Menunggu Verifikasi'],
    ];

    details.forEach((detail, index) => {
      doc.text(detail[0], 20, startY + 10 + (index * lineHeight));
      doc.text(detail[1], 20 + colWidth, startY + 10 + (index * lineHeight));
    });
    
    // Informasi lomba
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMASI LOMBA', 20, startY + 40);
    
    doc.setFont('helvetica', 'normal');
    const competitionDetails = [
      ['Kategori', ': ' + registrationData.schoolCategory],
      ['Jenis Lomba', ': ' + registrationData.competition],
    ];

    competitionDetails.forEach((detail, index) => {
      doc.text(detail[0], 20, startY + 50 + (index * lineHeight));
      doc.text(detail[1], 20 + colWidth, startY + 50 + (index * lineHeight));
    });
    
    // Informasi peserta
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMASI PESERTA', 20, startY + 80);
    
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
        doc.text(detail[0], 20, startY + 90 + (index * lineHeight));
        doc.text(detail[1], 20 + colWidth, startY + 90 + (index * lineHeight));
      }
    });

    // Tambahkan anggota tim jika ada
    if (registrationData.teamMembers && registrationData.teamMembers.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('ANGGOTA TIM', 20, startY + 140);
      
      doc.setFont('helvetica', 'normal');
      registrationData.teamMembers.forEach((member, index) => {
        doc.text(`${index + 1}. ${member}`, 20, startY + 150 + (index * lineHeight));
      });
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Catatan:', 20, pageHeight - 40);
    doc.text('1. Bukti pendaftaran ini adalah dokumen resmi, harap disimpan dengan baik', 25, pageHeight - 35);
    doc.text('2. Status pendaftaran akan diverifikasi oleh panitia dalam waktu 1x24 jam', 25, pageHeight - 30);
    doc.text('3. Informasi lebih lanjut akan dikirimkan melalui email yang telah didaftarkan', 25, pageHeight - 25);
    
    // Garis footer
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 15, 190, pageHeight - 15);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('FLASH Competition 2024 - Festival of Technology, Art and Science', 105, pageHeight - 10, { align: 'center' });
    
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
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Pendaftaran Berhasil!</h2>
        
        <div className="mb-6 space-y-2 text-gray-700">
          <p className="font-semibold">Detail Pendaftaran:</p>
          <p>Kode Pendaftaran: {registrationData.registrationCode}</p>
          <p>Kategori: {registrationData.schoolCategory}</p>
          <p>Lomba: {registrationData.competition}</p>
          {registrationData.teamName ? (
            <>
              <p>Nama Tim: {registrationData.teamName}</p>
              <p>Pendaftar: {registrationData.registrantName}</p>
            </>
          ) : (
            <p>Nama: {registrationData.name}</p>
          )}
          <p>Email: {registrationData.email}</p>
          <p>WhatsApp: {registrationData.whatsapp}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={generatePDF}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Unduh Bukti Pendaftaran
          </button>
          
          <button
            onClick={onClose}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RegistrationAlert;