import React from 'react';
import { motion } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import { Award, Star } from 'lucide-react';
import BSILogo from '../assets/img/BSI.png';
import BPDAcehLogo from '../assets/img/BPDAceh.png';
import Kominfo from '../assets/img/kominfo.png';
import Kemenhub from '../assets/img/kemenhub.png';
import Bazaars_1 from '../assets/img/bazaars/1.png';
import Bazaars_2 from '../assets/img/bazaars/2.jpg';
import Bazaars_3 from '../assets/img/bazaars/3.webp';
import Bazaars_4 from '../assets/img/bazaars/4.webp';
import Bazaars_5 from '../assets/img/bazaars/5.png';
import Bazaars_6 from '../assets/img/bazaars/6.jpg';

interface SocialProofData {
  partners: { name: string; logo: string }[];
  bazaars: { name: string; logo: string }[];
  awards: { name: string; icon: 'trophy' | 'star'; description: string }[];
}

const socialProofData: SocialProofData = {
  partners: [
    { name: 'BSI', logo: BSILogo },
    { name: 'BPDAceh', logo: BPDAcehLogo },
    { name: 'Kominfo', logo: Kominfo },
    { name: 'Kemenhub', logo: Kemenhub },
  ],
  bazaars: [
    { name: 'Bazaars_1', logo: Bazaars_1 },
    { name: 'Bazaars_2', logo: Bazaars_2 },
    { name: 'Bazaars_3', logo: Bazaars_3 },
    { name: 'Bazaars_4', logo: Bazaars_4 },
    { name: 'Bazaars_5', logo: Bazaars_5 },
    { name: 'Bazaars_6', logo: Bazaars_6 },
    { name: 'Bazaars_1', logo: Bazaars_1 },
    { name: 'Bazaars_2', logo: Bazaars_2 },
    { name: 'Bazaars_3', logo: Bazaars_3 },
    { name: 'Bazaars_4', logo: Bazaars_4 },
    { name: 'Bazaars_5', logo: Bazaars_5 },
    { name: 'Bazaars_6', logo: Bazaars_6 },
  ],
  awards: [
    { name: 'Best Tech Event 2023', icon: 'trophy', description: 'Awarded by TechEvents Global' },
    { name: 'Innovation Excellence', icon: 'star', description: 'Recognized by InnovateTech Magazine' },
    { name: 'Community Impact Award', icon: 'trophy', description: 'Presented by Local Tech Community' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

const createRowVariants = (direction: 'left' | 'right') => ({
  hidden: { x: direction === 'right' ? -100 : 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
      bounce: 0.5,
    },
  },
});

const SocialProof: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  
  if (!flashEvent) return null;

  const itemsPerRow = 6;
  const rows = Math.ceil(socialProofData.bazaars.length / itemsPerRow);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-6xl font-bold mb-6 text-gray-800 leading-tight"
            variants={itemVariants}
          >
            Trusted by the Best
          </motion.h2>
          <motion.div 
            className="bg-blue-600 w-24 h-2 mb-8 mx-auto"
            variants={itemVariants}
          ></motion.div>
          <motion.p 
            className="text-2xl text-gray-600 max-w-4xl mx-auto"
            variants={itemVariants}
          >
            Our partners and achievements that make FLASH a standout event
          </motion.p>
        </motion.div>

        {/* Partners Section */}
        <motion.div 
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Partners</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {socialProofData.partners.map((partner, index) => (
              <motion.div 
                key={index}
                className="w-40 h-40 bg-white rounded-lg shadow-md flex items-center justify-center p-4"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-32 h-32 relative">
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`} 
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bazaars Section */}
        <motion.div
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h3
            className="text-3xl font-bold mb-8 text-center text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Bazaars
          </motion.h3>
          {[...Array(rows)].map((_, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8"
              variants={createRowVariants(rowIndex % 2 === 0 ? 'right' : 'left')}
            >
              {socialProofData.bazaars.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow).map((bazaar, index) => (
                <motion.div
                  key={index}
                  className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-white rounded-lg shadow-md flex items-center justify-center p-3 sm:p-4"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-full h-full relative"
                    whileHover={{ rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    <img
                      src={bazaar.logo}
                      alt={`${bazaar.name} logo`}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Awards Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">Awards & Recognition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {socialProofData.awards.map((award, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {award.icon === 'trophy' ? (
                  <Award className="w-16 h-16 text-yellow-500 mb-4" />
                ) : (
                  <Star className="w-16 h-16 text-yellow-500 mb-4" />
                )}
                <h4 className="text-xl font-bold mb-2 text-gray-800">{award.name}</h4>
                <p className="text-gray-600">{award.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;