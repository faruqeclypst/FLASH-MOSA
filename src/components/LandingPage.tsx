import React, { useState, useEffect, useRef } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import Countdown from './Countdown';
import { TypeAnimation } from 'react-type-animation';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseLoader } from 'react-spinners';

interface LandingPageProps {
  onLoadingComplete: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoadingComplete }) => {
  const { data: flashEvent, loading, error } = useFirebase<FlashEvent>('flashEvent');
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!loading && !error) {
      const loadTimer = setTimeout(() => {
        setIsLoaded(true);
        onLoadingComplete(); // Call this when loading is complete
      }, 1000);
      return () => clearTimeout(loadTimer);
    }
  }, [loading, error, onLoadingComplete]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay was prevented:", error);
      });
    }
  }, [flashEvent]);

  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current) {
        const isMobile = window.innerWidth <= 768;
        const newSrc = isMobile ? flashEvent?.heroVideoMobile : flashEvent?.heroVideo;
        
        if (videoRef.current.src !== newSrc) {
          videoRef.current.style.opacity = '0';
          setTimeout(() => {
            videoRef.current!.src = newSrc || '';
            videoRef.current!.play().catch(console.error);
          }, 300);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [flashEvent]);

  if (error) return <div>Error: {error.message}</div>;

  const renderBackground = () => {
    const isMobile = window.innerWidth <= 768;
    
    if ((isMobile && flashEvent?.heroVideoMobile) || (!isMobile && flashEvent?.heroVideo)) {
      return (
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover bg-black"
          src={isMobile ? flashEvent.heroVideoMobile : flashEvent.heroVideo}
          loop
          muted
          playsInline
          style={{ transition: 'opacity 0.3s ease-in-out' }}
          onLoadStart={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
          onLoadedData={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        />
      );
    } else if (flashEvent?.heroImage) {
      return (
        <div 
          className="absolute inset-0 bg-black bg-cover bg-center"
          style={{backgroundImage: `url(${flashEvent.heroImage})`}}
        />
      );
    }
    return null;
  };

  return (
    <div className="relative min-h-screen bg-black">
      <AnimatePresence>
        {(loading || !isLoaded) && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-br from-emerald-900 to-purple-900"
          >
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white text-4x1 md:text-3xl font-bold mb-8 font-antistar"
            >
              Flash Celestiance
            </motion.h1>
            <PulseLoader color="#ffffff" size={20} margin={10} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen flex items-center justify-center"
      >
        {renderBackground()}
        <div className="absolute inset-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-purple-900/30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="z-10 text-center text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-48 sm:pt-20">
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-bold mb-8 font-antistar relative inline-block overflow-visible mt-8 pt-4">
              <span className="absolute -inset-4 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400/50 rounded-full animate-magic-particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '100%',
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </span>

              <span className="absolute inset-0 blur-md bg-gradient-to-r from-emerald-500 via-purple-500 to-emerald-500 opacity-40 animate-pulse"></span>

              <span className="relative bg-gradient-to-r from-emerald-200 via-purple-100 to-emerald-200 text-transparent bg-clip-text animate-glitch leading-relaxed">
                {flashEvent?.title || 'FLASH CELESTIANCE'}
              </span>
            </h1>
            {flashEvent?.eventDate && <Countdown eventDate={flashEvent.eventDate} />}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg sm:text-xl md:text-1xl lg:text-3xl mt-8 mb-12 max-w-4xl mx-auto h-[1.5em] font-antistar"
            >
              {isLoaded && (
                <TypeAnimation
                  sequence={[
                    'An event from SMAN Modal Bangsa',
                    2000,
                    'Future Language and Art for Smart Student of Highschool',
                    2000,
                    'Open Registration From 9 January 2025',
                    2000,
                  ]}
                  wrapper="span"
                  speed={65}
                  repeat={Infinity}
                  cursor={false}
                  deletionSpeed={95}
                />
              )}
            </motion.div>
            <div className="mt-12">
              <a 
                href="#competitions"
                className="relative inline-flex items-center justify-center px-8 py-4 font-bold text-lg
                         text-white bg-gradient-to-r from-emerald-900 to-emerald-800
                         rounded-full overflow-hidden shadow-lg
                         hover:from-emerald-800 hover:to-emerald-700
                         transform hover:scale-105 
                         transition-all duration-300 ease-out
                         group
                         focus:outline-none focus:ring-0"
                onClick={(e) => {
                  e.preventDefault();
                  const competitionsSection = document.getElementById('competitions');
                  if (competitionsSection) {
                    competitionsSection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full 
                               group-hover:w-full group-hover:h-full opacity-10" />
                               
                <span className="relative flex items-center gap-2 text-white font-antistar">
                  Daftar Lomba
                </span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;