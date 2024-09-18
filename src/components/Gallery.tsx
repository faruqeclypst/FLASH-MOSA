import React, { useState, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import { motion } from 'framer-motion';

const Gallery = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedImage ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  if (!flashEvent) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800">
          Competition Gallery
        </h2>
        <p className="text-xl text-center mb-12 text-gray-700">
          Explore the exciting moments from our previous competitions!
        </p>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {flashEvent.gallery && flashEvent.gallery.map((imageUrl, index) => (
            <motion.div 
              key={index} 
              className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImage(imageUrl)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transform transition duration-500 ease-in-out hover:scale-110"
                style={{backgroundImage: `url(${imageUrl})`}}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;