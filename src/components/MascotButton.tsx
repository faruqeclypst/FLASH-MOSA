import React, { useState } from 'react';
import MascotImage from '../assets/img/maskot-render.png';

const MascotButton: React.FC = () => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const handleInteraction = () => {
    setTooltipVisible(!isTooltipVisible);
  };

  return (
    <div className="fixed bottom-4 left-4 sm:left-6 md:left-8 z-40">
      <div 
        className="relative group"
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <img 
          src={MascotImage} 
          alt="Flash Celestiance Mascot" 
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain transform transition-transform duration-300 hover:scale-110 cursor-pointer"
        />
        <div 
          className={`absolute -top-6 left-[50%] bg-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full shadow-lg transition-all duration-300
            ${isTooltipVisible || 'group-hover:opacity-100' ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="text-emerald-800 font-antistar text-xs sm:text-sm md:text-base whitespace-nowrap">
            Hi! Saya Maskot Flash Celestiance
          </p>
          <div className="absolute -bottom-2 left-10 transform rotate-45 w-3 h-3 sm:w-4 sm:h-4 bg-white"></div>
        </div>
      </div>
    </div>
  );
};

export default MascotButton; 