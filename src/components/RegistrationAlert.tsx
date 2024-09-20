//src/components/RegistrationAlert.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface RegistrationAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationAlert: React.FC<RegistrationAlertProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Pendaftaran Berhasil!</h2>
        <p className="text-gray-700 mb-6">
          Selamat! Anda sudah melakukan pendaftaran FLASH. Silahkan tunggu email dari panitia untuk info berikutnya!
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Tutup
        </button>
      </div>
    </motion.div>
  );
};

export default RegistrationAlert;