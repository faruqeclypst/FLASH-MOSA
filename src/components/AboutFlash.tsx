import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import { useInView } from 'react-intersection-observer';

// Cache key for localStorage
const CACHE_KEY = 'flashEvent_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const AboutFlash: React.FC = () => {
  // State for cached data
  const [cachedData, setCachedData] = useState<FlashEvent | null>(null);
  const { data: firebaseData } = useFirebase<FlashEvent>('flashEvent');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const controls = useAnimation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const loadCachedData = () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired) {
          setCachedData(data);
          return true;
        }
        localStorage.removeItem(CACHE_KEY);
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
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setCachedData(firebaseData);
    }
  }, [firebaseData]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (inView || !isMobile) {
      controls.start('visible');
    }
  }, [controls, inView, isMobile]);

  // Use cached data if available, otherwise fallback to firebase data
  const flashEvent = cachedData || firebaseData;

  if (!flashEvent) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section id="about" className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-100 overflow-hidden">
      <motion.div
        ref={ref}
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div className="lg:w-3/5" variants={itemVariants}>
            <div className="max-w-2xl mx-auto lg:mx-0">
            <motion.div className="mb-12" variants={itemVariants}>
          <h2 className="text-4xl font-extrabold mb-4 text-gray-800 leading-tight font-antistar">
            Discover The Power Of <span className="text-green-800">Flash</span>
          </h2>
        </motion.div>
              <p className="text-lg leading-relaxed text-gray-700 mb-8 font-inter">{flashEvent.aboutFlash}</p>
            </div>
          </motion.div>
          <motion.div 
            className="lg:w-2/5"
            variants={itemVariants}
            whileHover={{ scale: 1.10 }}
            transition={{
              type: "keyframes",
              duration: 0.4,
              times: [0, 0.5, 1],
              ease: "easeInOut",
            }}
          >
            <div className="flex justify-center items-center h-full">
              <motion.img 
                src={flashEvent.aboutImage || "/api/placeholder/600/400"}
                alt="About Flash Celestiance" 
                className="w-auto h-auto max-w-full max-h-[1000px] object-contain relative"
                style={{
                  filter: `
                    drop-shadow(-20px -20px 30px rgba(16, 185, 129, 0.2))
                    drop-shadow(20px 20px 30px rgba(147, 51, 234, 0.2))
                    drop-shadow(0 0 20px rgba(16, 185, 129, 0.15))
                    drop-shadow(0 0 40px rgba(147, 51, 234, 0.15))
                  `
                }}
                variants={itemVariants}
                whileHover={{
                  filter: `
                    drop-shadow(-20px -20px 30px rgba(16, 185, 129, 0.3))
                    drop-shadow(20px 20px 30px rgba(147, 51, 234, 0.3))
                    drop-shadow(0 0 30px rgba(16, 185, 129, 0.25))
                    drop-shadow(0 0 50px rgba(147, 51, 234, 0.25))
                  `,
                  transition: { duration: 0.3 }
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutFlash;