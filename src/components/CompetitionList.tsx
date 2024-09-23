//src/components/CompetitionList.tsx
import React, { useState } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Competition } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaChevronDown, FaChevronUp, FaUsers, FaClock } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

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

const CompetitionCard: React.FC<{ 
  competition: Competition; 
  index: number;
  isMobile: boolean;
  isExpanded: boolean;
  toggleExpand: () => void;
}> = ({ competition, index, isMobile, isExpanded, toggleExpand }) => {
  if (isMobile) {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md mb-4"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{competition.name}</h3>
            <button
              onClick={toggleExpand}
              className="text-blue-600"
            >
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          <img 
            src={competition.icon || 'path/to/default/image.jpg'} 
            alt={`${competition.name} icon`} 
            className="w-full h-40 object-cover rounded-lg mb-2"
          />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-4"
            >
              <p className="text-gray-600 text-sm mb-2">{competition.description}</p>
              <div className="flex items-center space-x-4 text-gray-500 text-sm mb-2">
                <div className="flex items-center">
                  <FaUsers className="mr-1" />
                  <span>2-4 Players</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>60 Minutes</span>
                </div>
              </div>
              <h4 className="font-semibold text-sm mb-1 text-gray-700">Rules:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {competition.rules?.map((rule, ruleIndex) => (
                  <li key={ruleIndex}>{rule}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2">
          <FaTrophy className="text-2xl text-white" />
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2">{competition.name}</h3>
          <p className="text-white text-opacity-80 text-sm mb-4">{competition.description}</p>
          <div className="flex items-center space-x-4 text-white text-sm">
            <div className="flex items-center">
              <FaUsers className="mr-2" />
              <span>2-4 Players</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2" />
              <span>60 Minutes</span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-40 h-40 overflow-hidden">
          {competition.icon ? (
            <img 
              src={competition.icon} 
              alt={`${competition.name} icon`} 
              className="w-full h-full object-cover rounded-tl-full border-t-4 border-l-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white bg-opacity-20 rounded-tl-full">
              <FaTrophy className="text-4xl text-white opacity-20" />
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        <motion.button
          onClick={toggleExpand}
          className="flex items-center justify-between w-full text-blue-600 font-semibold text-sm bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors duration-300"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isExpanded ? 'Hide Rules' : 'Show Rules'}
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </motion.button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-gray-50 p-4 rounded-lg"
            >
              <h4 className="font-bold text-sm mb-2 text-gray-700">Rules:</h4>
              <ul className="space-y-2">
                {competition.rules?.map((rule, ruleIndex) => (
                  <motion.li 
                    key={ruleIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ruleIndex * 0.1 }}
                    className="flex items-start"
                  >
                    <span className="inline-block w-5 h-5 bg-blue-100 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {ruleIndex + 1}
                    </span>
                    <span className="text-gray-600 text-sm">{rule}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const CompetitionList: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!flashEvent || !flashEvent.competitions) return null;

  const toggleExpand = (index: number) => {
    setExpandedIndex(prevIndex => prevIndex === index ? null : index);
  };

  return (
    <section id="competitions" className={`py-8 ${isMobile ? 'bg-gray-100' : 'bg-gradient-to-b from-gray-100 to-white'}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold mb-2 text-gray-800 leading-tight`}
            variants={itemVariants}
          >
            {isMobile ? 'Our Competitions' : 'Our Exciting Competitions'}
          </motion.h2>
          {!isMobile && (
            <>
              <motion.div 
                className="bg-blue-600 w-24 h-2 mb-8 mx-auto"
                variants={itemVariants}
              ></motion.div>
              <motion.p 
                className="text-2xl text-gray-600 max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Showcase your skills and compete with the best in our thrilling competitions
              </motion.p>
            </>
          )}
        </motion.div>
        <motion.div
          className={isMobile ? '' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {flashEvent.competitions.map((competition, index) => (
            <CompetitionCard 
              key={index}
              competition={competition} 
              index={index}
              isMobile={isMobile}
              isExpanded={expandedIndex === index}
              toggleExpand={() => toggleExpand(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CompetitionList;