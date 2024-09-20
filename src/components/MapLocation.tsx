// src/components/MapLocation.tsx

import React, { useRef, useEffect, useState } from 'react';
import { Trophy, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const MapLocation: React.FC = () => {
  const highlightRef = useRef<HTMLDivElement>(null);
  const [mapHeight, setMapHeight] = useState('300px');

  useEffect(() => {
    const updateMapHeight = () => {
      if (highlightRef.current) {
        setMapHeight(`${highlightRef.current.offsetHeight}px`);
      }
    };

    updateMapHeight();
    window.addEventListener('resize', updateMapHeight);

    return () => {
      window.removeEventListener('resize', updateMapHeight);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section id="location" className="py-12 md:py-24 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-4 md:mb-8 text-gray-800 leading-tight"
            variants={itemVariants}
          >
            Our Location & Event Highlights
          </motion.h2>
          <motion.div className="bg-blue-600 w-24 h-2 mb-6 md:mb-8 mx-auto" variants={itemVariants}></motion.div>
        </motion.div>

        <motion.div 
          className="flex flex-col md:flex-row gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="w-full md:w-2/3" variants={itemVariants}>
            <div style={{ height: mapHeight, transition: 'height 0.3s ease' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.393637804538!2d95.39312037498486!3d5.50843649447156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30404789b47e89ab%3A0xb253dc7568697eaf!2sSMA%20Negeri%20Modal%20Bangsa!5e0!3m2!1sid!2sid!4v1726664140843!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>
          <motion.div 
            ref={highlightRef} 
            className="w-full md:w-1/3 bg-white p-4 md:p-6 rounded-lg shadow-lg"
            variants={itemVariants}
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Event Highlights</h3>
            <div className="space-y-4 md:space-y-6">
              <motion.div className="flex items-center" variants={itemVariants}>
                <Trophy className="text-yellow-500 mr-3 md:mr-4" size={20} />
                <div>
                  <p className="text-base md:text-lg font-bold">10+</p>
                  <p className="text-sm md:text-base text-gray-600">Awards Won</p>
                </div>
              </motion.div>
              <motion.div className="flex items-center" variants={itemVariants}>
                <Users className="text-blue-500 mr-3 md:mr-4" size={20} />
                <div>
                  <p className="text-base md:text-lg font-bold">1000+</p>
                  <p className="text-sm md:text-base text-gray-600">Participants</p>
                </div>
              </motion.div>
              <motion.div className="flex items-center" variants={itemVariants}>
                <Calendar className="text-green-500 mr-3 md:mr-4" size={20} />
                <div>
                  <p className="text-base md:text-lg font-bold">August 15-17, 2023</p>
                  <p className="text-sm md:text-base text-gray-600">Event Date</p>
                </div>
              </motion.div>
            </div>
            <motion.div className="mt-6 md:mt-8" variants={itemVariants}>
              <h4 className="text-lg md:text-xl font-semibold mb-2">Address</h4>
              <p className="text-sm md:text-base text-gray-600">
              Jl. Bandara Sultan Iskandar Muda No.Km. 12.5, Cot Geundreut, Kec. Blang Bintang, Kabupaten Aceh Besar, Aceh 23360
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MapLocation;