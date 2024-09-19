import React, { useState } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Competition } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaChevronDown, FaChevronUp, FaUsers, FaClock } from 'react-icons/fa';

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
}> = ({ competition, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

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
              <FaTrophy className="text-6xl text-white opacity-20" />
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

  if (!flashEvent || !flashEvent.competitions) return null;

  return (
    <section id="competitions" className="py-24 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
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
            Our Exciting Competitions
          </motion.h2>
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
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CompetitionList;

// import React, { useState } from 'react';
// import { useFirebase } from '../hooks/useFirebase';
// import { FlashEvent, Competition } from '../types';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaTrophy, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// const CompetitionCard: React.FC<{ 
//   competition: Competition; 
//   index: number;
//   isExpanded: boolean;
//   toggleExpand: () => void;
// }> = ({ competition, index, isExpanded, toggleExpand }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
//     >
//       <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
//         <div className="absolute inset-0 flex items-center justify-center">
//           {competition.icon ? (
//             <img 
//               src={competition.icon} 
//               alt={`${competition.name} icon`} 
//               className="w-20 h-20 object-cover rounded-full border-4 border-white"
//             />
//           ) : (
//             <FaTrophy className="text-5xl text-white" />
//           )}
//         </div>
//       </div>
//       <div className="p-6">
//         <h3 className="text-xl font-bold text-gray-800 mb-2">{competition.name}</h3>
//         <p className="text-gray-600 text-sm mb-4">{competition.description}</p>
//         <button
//           onClick={toggleExpand}
//           className="flex items-center justify-between w-full text-blue-600 font-semibold text-sm"
//         >
//           {isExpanded ? 'Hide Rules' : 'Show Rules'}
//           {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
//         </button>
//         <AnimatePresence>
//           {isExpanded && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="mt-4"
//             >
//               <h4 className="font-bold text-sm mb-2 text-gray-700">Rules:</h4>
//               <ul className="list-disc list-inside text-gray-600 text-sm">
//                 {competition.rules?.map((rule, ruleIndex) => (
//                   <li key={ruleIndex}>{rule}</li>
//                 ))}
//               </ul>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   );
// };

// const CompetitionList: React.FC = () => {
//   const { data: flashEvent, loading, error } = useFirebase<FlashEvent>('flashEvent');
//   const [isExpanded, setIsExpanded] = useState(false);

//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded);
//   };

//   if (loading) return <div className="text-center py-10">Loading competitions...</div>;
//   if (error) return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;
//   if (!flashEvent?.competitions?.length) return <div className="text-center py-10">No competitions available.</div>;

//   return (
//     <section id="competitions" className="py-16 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">Our Exciting Competitions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {flashEvent.competitions.map((competition, index) => (
//             <CompetitionCard 
//               key={index} 
//               competition={competition} 
//               index={index}
//               isExpanded={isExpanded}
//               toggleExpand={toggleExpand}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CompetitionList;