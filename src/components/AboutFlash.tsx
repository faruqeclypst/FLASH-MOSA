import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import { useInView } from 'react-intersection-observer';

const AboutFlash: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const controls = useAnimation();
  const [isMobile, setIsMobile] = useState(false);

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
          <h2 className="text-4xl font-extrabold mb-4 text-gray-800 leading-tight">
            DISCOVER THE POWER OF <span className="text-blue-600">FLASH</span>
          </h2>
          <div className="bg-blue-600 w-24 h-2 mb-8 rounded-full"></div>
        </motion.div>
              <p className="text-2xl leading-relaxed text-gray-700 mb-8">{flashEvent.aboutFlash}</p>
              <ul className="text-xl text-gray-700 mb-8 space-y-4">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Innovative Technology
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Cutting-edge Solutions
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Unparalleled Performance
                </li>
              </ul>
            </div>
          </motion.div>
          <motion.div 
  className="lg:w-2/5"
  variants={itemVariants}
  whileHover={{ scale: 1.32 }}
  transition={{
    type: "keyframes",
    duration: 0.58,
    times: [0, 0.5, 1],
    ease: "easeInOut",
  }}
>
            <div className="flex justify-center items-center h-full">
              <motion.img 
                src={flashEvent.aboutImage || "/api/placeholder/600/400"}
                alt="About FLASH" 
                className="w-auto h-auto max-w-full max-h-[1000px] object-contain filter drop-shadow-2xl"
                variants={itemVariants}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutFlash;