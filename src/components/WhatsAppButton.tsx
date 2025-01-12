import React, { useState, useEffect } from 'react';
import MascotImage from '../assets/img/maskot-render.png';
import { X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
  name: string;
  phoneNumber: string;
}

const contacts: Contact[] = [
  {
    name: "Nadif (Media Partner)", 
    phoneNumber: "6282261045659"
  },
  {
    name: "Jauza (Sponsor)", 
    phoneNumber: "6282377543024"
  }
];

const WhatsAppButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showText, setShowText] = useState(true);
  const [showMascot, setShowMascot] = useState(true);
  const message = "Assalamualaikum! Kami tertarik untuk sponsor Flash Celestiance!\n\nMohon informasi lebih lanjut!";
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile && showMascot) {
      const showMessageTimeout = setTimeout(() => {
        setShowText(true);
      }, 1000);

      const hideMessageTimeout = setTimeout(() => {
        setShowText(false);
      }, 3000);

      const messageInterval = setInterval(() => {
        setShowText(true);
        setTimeout(() => {
          setShowText(false);
        }, 3000);
      }, 50000);

      return () => {
        clearTimeout(showMessageTimeout);
        clearTimeout(hideMessageTimeout);
        clearInterval(messageInterval);
      };
    } else {
      setShowText(false);
    }
  }, [isMobile, showMascot]);

  const handleContactClick = (phoneNumber: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    setShowModal(false);
  };

  // Modal Component
  const ContactModal = () => (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Hubungi Kami</h3>
                  <p className="text-emerald-100 text-sm mt-1">Pilih kontak sponsor kami</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Contact List */}
            <div className="p-6 space-y-4">
              {contacts.map((contact) => (
                <motion.button
                  key={contact.phoneNumber}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContactClick(contact.phoneNumber)}
                  className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-xl transition-all duration-300 group border border-emerald-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-emerald-600 group-hover:to-emerald-700 transition-colors shadow-lg">
                    <FaWhatsapp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-emerald-900">{contact.name}</p>
                    <p className="text-sm text-emerald-600 mt-0.5">+{contact.phoneNumber}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-t border-emerald-200">
              <p className="text-sm text-emerald-700 text-center font-medium">
                Klik kontak untuk mengirim pesan WhatsApp
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <AnimatePresence>
        {showMascot && (
          <motion.div 
            className="fixed bottom-2 right-2 z-[60]"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative pointer-events-auto">
              {/* Close Button - kondisional untuk mobile */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMascot(false);
                }}
                className={`absolute -top-2 ${
                  isMobile ? '-right-0' : '-right-2'
                } z-[61] bg-emerald-800 rounded-full p-1 shadow-lg hover:bg-emerald-700 transition-colors`}
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                className="relative group cursor-pointer pointer-events-auto"
              >
                <img 
                  src={MascotImage} 
                  alt="WhatsApp Mascot" 
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain transform transition-transform duration-300 hover:scale-110"
                />
                <motion.div 
                  initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ 
                    opacity: isMobile 
                      ? (showText ? 1 : 0)
                      : 1 
                  }}
                  transition={{ duration: 0.5 }}
                  className={`absolute ${
                    isMobile 
                      ? 'left-[-180%] top-[40%]' // Geser pesan lebih ke kiri di mobile
                      : '-top-6 right-[80%] translate-x-1/2'
                  } bg-emerald-800 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full shadow-lg ${
                    !isMobile ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-300' : ''
                  }`}
                >
                  <p className="text-white font-antistar text-xs sm:text-sm md:text-base whitespace-nowrap">
                    Hubungi Kami via WhatsApp
                  </p>
                  <div className={`absolute ${
                    isMobile
                      ? '-right-2 top-1/2 -translate-y-1/2 rotate-[-45deg]'
                      : '-bottom-2 right-6 rotate-45'
                  } w-3 h-3 sm:w-4 sm:h-4 bg-emerald-800`}></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Mascot Button */}
      <AnimatePresence>
        {!showMascot && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMascot(true);
            }}
            className="fixed bottom-4 right-4 z-[60] bg-emerald-800 rounded-full p-3 shadow-lg hover:bg-emerald-700 transition-colors pointer-events-auto"
          >
            <FaWhatsapp className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal tetap sama */}
      <ContactModal />
    </>
  );
};

export default WhatsAppButton; 