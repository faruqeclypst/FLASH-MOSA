import React, { useState } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Competition } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CompetitionCard: React.FC<{ 
  competition: Competition; 
  index: number;
  isExpanded: boolean;
  toggleExpand: () => void;
}> = ({ competition, index, isExpanded, toggleExpand }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          {competition.icon ? (
            <img 
              src={competition.icon} 
              alt={`${competition.name} icon`} 
              className="w-20 h-20 object-cover rounded-full border-4 border-white"
            />
          ) : (
            <FaTrophy className="text-5xl text-white" />
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{competition.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{competition.description}</p>
        <button
          onClick={toggleExpand}
          className="flex items-center justify-between w-full text-blue-600 font-semibold text-sm"
        >
          {isExpanded ? 'Hide Rules' : 'Show Rules'}
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <h4 className="font-bold text-sm mb-2 text-gray-700">Rules:</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm">
                {competition.rules?.map((rule, ruleIndex) => (
                  <li key={ruleIndex}>{rule}</li>
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
  const { data: flashEvent, loading, error } = useFirebase<FlashEvent>('flashEvent');
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) return <div className="text-center py-10">Loading competitions...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;
  if (!flashEvent?.competitions?.length) return <div className="text-center py-10">No competitions available.</div>;

  return (
    <section id="competitions" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">Our Exciting Competitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flashEvent.competitions.map((competition, index) => (
            <CompetitionCard 
              key={index} 
              competition={competition} 
              index={index}
              isExpanded={isExpanded}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompetitionList;