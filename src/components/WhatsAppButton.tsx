import React, { useState, useEffect } from 'react';
import MascotImage from '../assets/img/maskot-render.png';

interface Contact {
  name: string;
  phoneNumber: string;
}

const contacts: Contact[] = [
  {
    name: "Nadif (Sponsor)", 
    phoneNumber: "6282261045659"
  },
  {
    name: "Jauza (Sponsor)", 
    phoneNumber: "6282377543024"
  }
];

const WhatsAppButton: React.FC = () => {
  const [showContacts, setShowContacts] = useState(false);
  const message = "Assalamualaikum! Kami tertarik untuk sponsor Flash Celestiance!\n\nMohon informasi lebih lanjut!";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.whatsapp-button-container')) {
        setShowContacts(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContactClick = (phoneNumber: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="fixed bottom-4 right-4">
      <div className="relative whatsapp-button-container">
        {showContacts && (
          <div className="absolute bottom-full right-0 mb-18 bg-white rounded-lg shadow-xl p-4 w-64">
            {contacts.map((contact) => (
              <button
                key={contact.phoneNumber}
                onClick={() => handleContactClick(contact.phoneNumber)}
                className="w-full text-left p-3 hover:bg-gray-100 rounded-lg mb-2 last:mb-0 flex items-center space-x-2"
              >
                <span className="text-emerald-800 font-medium">{contact.name}</span>
              </button>
            ))}
          </div>
        )}

        <div 
          onClick={(e) => {
            e.stopPropagation();
            setShowContacts(!showContacts);
          }}
          className="relative group cursor-pointer"
        >
          <img 
            src={MascotImage} 
            alt="WhatsApp Mascot" 
            className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain transform transition-transform duration-300 hover:scale-110"
          />
          {isMobile ? (
            <div className="absolute -top-6 right-[80%] translate-x-1/2 bg-emerald-800 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full shadow-lg">
              <p className="text-white font-antistar text-xs sm:text-sm md:text-base whitespace-nowrap">
                Hubungi Kami via WhatsApp
              </p>
              <div className="absolute -bottom-2 right-6 transform rotate-45 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-800"></div>
            </div>
          ) : (
            <div className="absolute -top-6 right-[80%] translate-x-1/2 bg-emerald-800 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white font-antistar text-xs sm:text-sm md:text-base whitespace-nowrap">
                Hubungi Kami via WhatsApp
              </p>
              <div className="absolute -bottom-2 right-6 transform rotate-45 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-800"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppButton; 