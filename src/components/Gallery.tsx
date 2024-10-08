import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

const Gallery: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    document.body.style.overflow = viewerOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [viewerOpen]);

  if (!flashEvent || !flashEvent.gallery) return null;

  const images = flashEvent.gallery;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

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
    <section id="gallery" className="py-12 sm:py-24 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-4xl sm:text-4xl font-bold mb-4 sm:mb-8 text-gray-800 leading-tight"
            variants={itemVariants}
          >
            Event Highlights
          </motion.h2>
          {!isMobile && (
            <>
              <motion.div className="bg-blue-600 w-24 h-2 mb-8 mx-auto" variants={itemVariants}></motion.div>
              <motion.p className="text-xl sm:text-2xl leading-relaxed text-gray-700 mb-8" variants={itemVariants}>
                Immerse yourself in the vibrant moments of our past events
              </motion.p>
            </>
          )}
        </motion.div>

        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="overflow-hidden rounded-lg shadow-2xl">
            <motion.img 
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              className="w-full h-[300px] sm:h-[600px] object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <button 
            onClick={prevImage} 
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 sm:p-2 transition-all duration-300"
          >
            <ChevronLeft size={isMobile ? 20 : 24} />
          </button>
          <button 
            onClick={nextImage} 
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 sm:p-2 transition-all duration-300"
          >
            <ChevronRight size={isMobile ? 20 : 24} />
          </button>
          <button 
            onClick={() => setViewerOpen(true)} 
            className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 sm:p-2 transition-all duration-300"
          >
            <Maximize2 size={isMobile ? 20 : 24} />
          </button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mt-4 sm:mt-8"
          variants={containerVariants}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={`cursor-pointer rounded-lg overflow-hidden ${index === currentIndex ? 'ring-2 sm:ring-4 ring-blue-600' : ''}`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentIndex(index)}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-16 sm:h-24 object-cover" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {viewerOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img 
              src={images[currentIndex]} 
              alt="Full size image" 
              className="max-w-[90%] max-h-[90vh] object-contain"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <button 
              onClick={() => setViewerOpen(false)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white bg-red-600 rounded-full p-1 sm:p-2 hover:bg-red-700 transition-colors duration-300"
            >
              <X size={isMobile ? 20 : 24} />
            </button>
            <button 
              onClick={prevImage}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 sm:p-2 transition-all duration-300"
            >
              <ChevronLeft size={isMobile ? 20 : 24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 sm:p-2 transition-all duration-300"
            >
              <ChevronRight size={isMobile ? 20 : 24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;