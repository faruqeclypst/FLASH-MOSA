import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-yellow-600 text-xl" />
                </div>
              </div>

              <h3 className="text-center text-xl font-bold text-gray-900 mb-4 font-antistar">
                Informasi Penting
              </h3>

              <div className="space-y-4 text-gray-600">
                <p className="text-center">
                  Harap melakukan pendaftaran segera, jangan menunggu di akhir-akhir periode pendaftaran untuk menghindari:
                </p>
                
                <div className="space-y-3">
                <div className="flex items-center bg-red-50 p-4 rounded-lg border border-red-200">
                  <span className="text-red-700">Penuhnya kuota pendaftaran lomba</span>
                </div>
                    
                <div className="flex items-center bg-red-50 p-4 rounded-lg border border-red-200">
                  <span className="text-red-700">Gangguan sistem karena banyak yang mengakses web Flash Celestiance</span>
                </div>
              </div>

                <p className="text-center font-bold text-emerald-600">
                  Daftar Sekarang Ya!
                </p>

                <p className="text-center italic">
                  Salam Hangat<br />
                  Panitia FLASH!
                </p>
              </div>

              {/* Close button */}
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Saya Mengerti
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal; 