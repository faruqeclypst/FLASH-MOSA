import React, { useState, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import Countdown from './Countdown';
import { TypeAnimation } from 'react-type-animation';

const LandingPage: React.FC = () => {
  const { data: flashEvent, loading, error } = useFirebase<FlashEvent>('flashEvent');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !error) {
      const timer = setTimeout(() => setIsLoaded(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, error]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={`relative min-h-screen flex items-center justify-center bg-cover bg-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
         style={{backgroundImage: flashEvent ? `url(${flashEvent.heroImage})` : 'none'}}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className={`z-10 text-center text-white transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h1 className="text-4xl md:text-8xl font-bold mb-4">{flashEvent?.title || 'FLASH'} {new Date().getFullYear()}</h1>
        {flashEvent?.eventDate && <Countdown eventDate={flashEvent.eventDate} />}
        <p className="text-xl md:text-4xl mb-8">
          <TypeAnimation
            sequence={[
              'Future Language and Art for Smart Student of Highschool',
              2000,
            ]}
            wrapper="span"
            speed={10}
            repeat={Infinity}
          />
        </p>
        <a href="#about" className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold text-lg hover:bg-blue-100 transition duration-300">
          Yuk Ikuti!
        </a>
      </div>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;