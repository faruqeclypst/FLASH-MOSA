

import React, { useState, useEffect, useRef } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import Countdown from './Countdown';
import { TypeAnimation } from 'react-type-animation';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseLoader } from 'react-spinners';

const LandingPage: React.FC = () => {
  const { data: flashEvent, loading, error } = useFirebase<FlashEvent>('flashEvent');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!loading && !error) {
      const loadTimer = setTimeout(() => {
        setIsLoaded(true);
        setTimeout(() => setShowTyping(true), 500);
      }, 1000);
      return () => clearTimeout(loadTimer);
    }
  }, [loading, error]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay was prevented:", error);
      });
    }
  }, [flashEvent]);

  if (error) return <div>Error: {error.message}</div>;

  const renderBackground = () => {
    if (flashEvent?.heroVideo) {
      return (
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={flashEvent.heroVideo}
          loop
          muted
          playsInline
        />
      );
    } else if (flashEvent?.heroImage) {
      return (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{backgroundImage: `url(${flashEvent.heroImage})`}}
        />
      );
    }
    return null;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <AnimatePresence>
        {(loading || !isLoaded) && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50"
          >
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white text-4xl md:text-4xl font-bold mb-8"
            >
              FLASH MOSA
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
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="z-10 text-center text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-bold mb-4">{flashEvent?.title || 'FLASH'}</h1>
            {flashEvent?.eventDate && <Countdown eventDate={flashEvent.eventDate} />}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showTyping ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg sm:text-xl md:text-1xl lg:text-3xl mb-11 max-w-4xl mx-auto h-[1.5em]"
            >
              {showTyping && (
                <TypeAnimation
                  sequence={[
                    'Future Language and Art for Smart Student of Highschool',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              )}
            </motion.div>
            <a 
              href="#registration" 
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold text-lg hover:bg-blue-100 transition duration-300"
            >
              DAFTAR SEKARANG!
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;