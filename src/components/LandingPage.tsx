import React, { useState, useEffect, useRef } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import Countdown from './Countdown';
import { TypeAnimation } from 'react-type-animation';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { FaPlay } from 'react-icons/fa';

// Add cache constants
const LANDING_CACHE_KEY = 'landing_page_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface LandingPageProps {
  onLoadingComplete: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoadingComplete }) => {
  const { data: firebaseData, loading, error } = useFirebase<FlashEvent>('flashEvent');
  const [cachedData, setCachedData] = useState<FlashEvent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Add caching logic
  useEffect(() => {
    const loadCachedData = () => {
      const cached = localStorage.getItem(LANDING_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired) {
          setCachedData(data);
          return true;
        }
        localStorage.removeItem(LANDING_CACHE_KEY);
      }
      return false;
    };

    // Try to load from cache first
    const hasCachedData = loadCachedData();

    // If we have new Firebase data and no valid cache, update cache
    if (firebaseData && !hasCachedData) {
      const cacheData = {
        data: firebaseData,
        timestamp: Date.now()
      };
      localStorage.setItem(LANDING_CACHE_KEY, JSON.stringify(cacheData));
      setCachedData(firebaseData);
    }
  }, [firebaseData]);

  useEffect(() => {
    if (!loading && !error && userInteracted) {
      const loadTimer = setTimeout(() => {
        setIsLoaded(true);
        onLoadingComplete();
      }, 1000);
      return () => clearTimeout(loadTimer);
    }
  }, [loading, error, onLoadingComplete, userInteracted]);

  // Use cached data if available
  const flashEvent = cachedData || firebaseData;

  useEffect(() => {
    if (videoRef.current && userInteracted) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay was prevented:", error);
      });
    }
  }, [flashEvent, userInteracted]);

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

  const handleEnterWebsite = () => {
    setUserInteracted(true);
  };

  if (error) return <div>Error: {error.message}</div>;

  if (!userInteracted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-br from-emerald-900 to-purple-900"
      >
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full">
          <div className="flex flex-col items-center">
            {flashEvent?.titleImage && (
              <motion.div 
                className="relative z-10"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <motion.img 
                  src={flashEvent.titleImage} 
                  alt={flashEvent.title || 'FLASH CELESTIANCE'}
                  className="w-auto h-32 md:h-40 lg:h-56 xl:h-64"
                  style={{
                    filter: `
                      drop-shadow(0 -8px 10px rgba(16, 185, 129, 0.4))
                      drop-shadow(0 8px 10px rgba(147, 51, 234, 0.4))
                      drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))
                    `
                  }}
                  animate={{
                    filter: [
                      `
                        drop-shadow(0 -8px 10px rgba(16, 185, 129, 0.4))
                        drop-shadow(0 8px 10px rgba(147, 51, 234, 0.4))
                        drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))
                      `,
                      `
                        drop-shadow(0 -8px 10px rgba(16, 185, 129, 0.2))
                        drop-shadow(0 8px 10px rgba(147, 51, 234, 0.2))
                        drop-shadow(0 0 3px rgba(255, 255, 255, 0.2))
                      `,
                      `
                        drop-shadow(0 -8px 10px rgba(16, 185, 129, 0.4))
                        drop-shadow(0 8px 10px rgba(147, 51, 234, 0.4))
                        drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))
                      `
                    ],
                    transition: {
                      filter: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }
                  }}
                  onLoad={() => {
                    setTimeout(() => {
                      setImageLoaded(true);
                    }, 800);
                  }}
                />
              </motion.div>
            )}
            
            <AnimatePresence>
              {imageLoaded && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 0 }}
                  animate={{ scale: 1, opacity: 1, y: 30 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1],
                    opacity: { duration: 0.5 },
                    y: { 
                      type: "spring",
                      damping: 15,
                      stiffness: 100
                    }
                  }}
                  className="relative w-full flex justify-center mt-4"
                >
                  <div className="relative max-w-[300px]">
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-purple-600 rounded-full blur-md opacity-75"
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEnterWebsite}
                      className="relative px-8 py-4 bg-gradient-to-r from-emerald-900 to-purple-900 
                               rounded-full flex items-center justify-center
                               text-white font-antistar text-lg md:text-xl
                               shadow-xl shadow-emerald-900/30
                               border border-white/10
                               min-w-[200px] md:min-w-[250px]
                               transition-all duration-300"
                    >
                      <div className="flex items-center justify-center w-full gap-4 translate-y-[7px]">
                        <motion.div
                          animate={{
                            rotate: 360
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <FaPlay className="text-xl text-emerald-400" />
                        </motion.div>
                        <span className="tracking-wide">Enter Website</span>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Decorative particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => {
            const getRandomPosition = () => ({
              left: Math.random() * 100,
              top: Math.random() * 100,
            });

            return (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white rounded-full"
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.2, 0],
                  y: [-20, -40],
                  left: Array(3).fill(0).map(() => `${getRandomPosition().left}%`),
                  top: Array(3).fill(0).map(() => `${getRandomPosition().top}%`),
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                  times: [0, 0.5, 1],
                  left: { duration: 0 },
                  top: { duration: 0 }
                }}
              />
            );
          })}

          {/* Glow particles */}
          {[...Array(15)].map((_, i) => {
            const getRandomPosition = () => ({
              left: 15 + Math.random() * 70,
              top: 15 + Math.random() * 70,
            });

            return (
              <motion.div
                key={`glow-${i}`}
                className="absolute w-1 h-1 bg-emerald-400/60 rounded-full"
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                  y: [-10, -20],
                  left: Array(3).fill(0).map(() => `${getRandomPosition().left}%`),
                  top: Array(3).fill(0).map(() => `${getRandomPosition().top}%`),
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeOut",
                  left: { duration: 0 },
                  top: { duration: 0 }
                }}
              />
            );
          })}
        </div>
      </motion.div>
    );
  }

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
            {flashEvent?.titleImage && (
              <motion.img 
                src={flashEvent.titleImage} 
                alt={flashEvent.title || 'FLASH CELESTIANCE'}
                className="w-auto h-32 md:h-40 lg:h-56 xl:h-64 mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  filter: `
                    drop-shadow(0 -8px 10px rgba(16, 185, 129, 0.4))
                    drop-shadow(0 8px 10px rgba(147, 51, 234, 0.4))
                    drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))
                  `
                }}
              />
            )}
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">
            <div className="md:mt-8 lg:mt-10">
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-2 font-antistar relative inline-block overflow-visible">
                {flashEvent?.titleType === 'image' && flashEvent?.titleImage ? (
                  <motion.div 
                    className="relative z-10"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <motion.img 
                      src={flashEvent.titleImage} 
                      alt={flashEvent.title || 'FLASH CELESTIANCE'}
                      className="relative w-auto h-32 md:h-32 lg:h-44 xl:h-48 mx-auto"
                      style={{
                        filter: `
                          drop-shadow(0 -8px 10px rgba(16, 185, 129, 0.4))
                          drop-shadow(0 8px 10px rgba(147, 51, 234, 0.4))
                          drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))
                        `
                      }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        filter: [
                          `
                            drop-shadow(0 -8px 10px rgba(16, 185, 129, 0.4))
                            drop-shadow(0 8px 10px rgba(147, 51, 234, 0.4))
                            drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))
                          `,
                          `
                            drop-shadow(0 -8px 10px rgba(16, 185, 129, 0.2))
                            drop-shadow(0 8px 10px rgba(147, 51, 234, 0.2))
                            drop-shadow(0 0 3px rgba(255, 255, 255, 0.2))
                          `,
                          `
                            drop-shadow(0 -8px 10px rgba(16, 185, 129, 0.4))
                            drop-shadow(0 8px 10px rgba(147, 51, 234, 0.4))
                            drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))
                          `
                        ],
                        transition: {
                          opacity: { duration: 0.5 },
                          filter: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }
                      }}
                      whileHover={{
                        filter: `
                          drop-shadow(0 -12px 12px rgba(16, 185, 129, 0.5))
                          drop-shadow(0 12px 12px rgba(147, 51, 234, 0.5))
                          drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))
                        `,
                        transition: { duration: 0.3 }
                      }}
                    />
                  </motion.div>
                ) : (
                  <>
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
                    <span className="relative bg-gradient-to-r from-emerald-200 via-purple-100 to-emerald-200 text-transparent bg-clip-text block">
                      <span className="block leading-[1.4] tracking-wide">
                        {flashEvent?.title || 'FLASH CELESTIANCE'}
                      </span>
                    </span>
                  </>
                )}
              </h1>
            </div>

            <div className="mb-2">
              {flashEvent?.eventDate && <Countdown eventDate={flashEvent.eventDate} />}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl -mt-2 mb-4 max-w-3xl mx-auto h-[1.5em] font-antistar"
            >
              {isLoaded && (
                <TypeAnimation
                  sequence={[
                    'Open Registration From 10 January 2025 - 10 February 2025',
                    2000,
                    'An event from SMAN Modal Bangsa',
                    2000,
                    'Future Language and Art for Smart Student of Highschool',
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

            <div className="mt-6 mb-4">
              <a 
                href="#competitions"
                className="relative inline-flex items-center justify-center 
                         px-4 py-2.5 md:px-6 md:py-3 font-bold text-sm md:text-base
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