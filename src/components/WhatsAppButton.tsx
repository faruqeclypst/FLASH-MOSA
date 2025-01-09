import React from 'react';
import MascotImage from '../assets/img/maskot-render.png';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, message }) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed bottom-2 right-4">
      <div 
        onClick={handleClick}
        className="relative group cursor-pointer"
      >
        <img 
          src={MascotImage} 
          alt="WhatsApp Mascot" 
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain transform transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute -top-6 right-[80%] translate-x-1/2 bg-emerald-800 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300">
          <p className="text-white font-antistar text-xs sm:text-sm md:text-base whitespace-nowrap">
            Hubungi Kami via WhatsApp
          </p>
          <div className="absolute -bottom-2 right-6 transform rotate-45 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-800"></div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppButton; 