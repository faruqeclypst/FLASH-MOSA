import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

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
    <div className="fixed bottom-4 right-4">
      <button
        onClick={handleClick}
        className="bg-green-500 text-white rounded-lg px-4 py-2 shadow-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center space-x-2"
        aria-label="Info Sponsor WhatsApp"
      >
        <FaWhatsapp size={24} />
        <span className="font-semibold">Sponsor</span>
      </button>
    </div>
  );
};

export default WhatsAppButton;