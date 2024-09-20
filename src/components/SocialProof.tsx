import React from 'react';
import { motion } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import { Award, Star } from 'lucide-react';
import BSILogo from '../assets/img/BSI.png';
import BPDAcehLogo from '../assets/img/BPDAceh.png';
import Kominfo from '../assets/img/kominfo.png';
import Kemenhub from '../assets/img/kemenhub.png';

interface SocialProofData {
  partners: { name: string; logo: string }[];
  awards: { name: string; icon: string; description: string }[];
}

const SocialProof: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  
  if (!flashEvent) return null;

  const socialProofData: SocialProofData = {
    partners: [
      { name: 'BSI', logo: BSILogo },
      { name: 'BPDAceh', logo: BPDAcehLogo },
      { name: 'Kominfo', logo: Kominfo },
      { name: 'Kemenhub', logo: Kemenhub },
    ],
    awards: [
      { name: 'Best Tech Event 2023', icon: 'trophy', description: 'Awarded by TechEvents Global' },
      { name: 'Innovation Excellence', icon: 'star', description: 'Recognized by InnovateTech Magazine' },
      { name: 'Community Impact Award', icon: 'users', description: 'Presented by Local Tech Community' },
    ],
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

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