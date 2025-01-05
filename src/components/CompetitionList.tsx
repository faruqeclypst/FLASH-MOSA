import React, { useEffect, useState, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Competition } from '../types';
import { useInView } from 'react-intersection-observer';
import { 
  FaUsers, 
  FaTrophy, 
  FaChevronRight, 
  FaGraduationCap, 
  FaClock,
  FaRegCalendarAlt,
  FaFilePdf,
  FaExternalLinkAlt,
  FaImage
} from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Komponen untuk tampilan accordion
const CompetitionAccordion: React.FC<{ 
  competition: Competition, 
  isOpen: boolean, 
  onClick: () => void,
  registrationDate: string,
  flashEvent: FlashEvent | null
}> = ({ 
  competition, 
  isOpen, 
  onClick,
  registrationDate,
  flashEvent
}) => {
  // Format tanggal
  const formattedRegistrationDate = registrationDate ? format(new Date(registrationDate), 'd MMMM yyyy', { locale: id }) : '-';
  const formattedEventDate = competition.eventDate ? format(new Date(competition.eventDate), 'd MMMM yyyy', { locale: id }) : '-';
  
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div 
        onClick={onClick}
        className={`cursor-pointer transition-all duration-300 ${
          isOpen ? 'bg-blue-50' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center p-4 sm:p-6">
          {/* Icon/Image */}
          <div className="w-20 h-20 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
            {competition.icon ? (
              <img 
                src={competition.icon} 
                alt={competition.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaTrophy className="text-white text-2xl opacity-75" />
              </div>
            )}
          </div>

          {/* Title and Basic Info */}
          <div className="ml-4 flex-grow">
            <h3 className="text-base sm:text-xl font-bold text-gray-900">
              {competition.name}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1 sm:mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium
                ${competition.type === 'team' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                <FaUsers className="mr-1" />
                {competition.type === 'team' ? `Team (${competition.teamSize})` : 'Individual'}
              </span>
              {competition.categories?.map((category, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <FaGraduationCap className="mr-1" />
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Expand Icon */}
          <FaChevronRight className={`text-gray-400 transform transition-transform duration-300 ${
            isOpen ? 'rotate-90' : ''
          }`} />
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-4 sm:p-6 space-y-4">
              {/* Description */}
              <div>
                <p className="text-gray-600">{competition.description}</p>
              </div>

              {/* Document and Logo Buttons */}
              <div className="flex flex-wrap justify-center w-full gap-3">
                {competition.documentUrl && (
                  <a
                    href={competition.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-300"
                  >
                    <FaFilePdf className="mr-2" />
                    Juknis Lomba
                  </a>
                )}
                
                {flashEvent?.aboutImage && (
                  <a
                    href={flashEvent.aboutImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                  >
                    <FaImage className="mr-2" />
                    Logo FLASH
                  </a>
                )}
              </div>

              {/* Rules */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Competition Rules</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {competition.rules?.map((rule, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-600">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline/Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <FaRegCalendarAlt className="text-green-700 mt-1 flex-shrink-0" />
                    <div className="ml-2">
                      <h4 className="font-medium text-green-700">Periode Pendaftaran</h4>
                      <p className="mt-1 text-sm text-green-600">
                        Dibuka hingga {formattedRegistrationDate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <FaClock className="text-blue-700 mt-1 flex-shrink-0" />
                    <div className="ml-2">
                      <h4 className="font-medium text-blue-700">Tanggal Pelaksanaan</h4>
                      <p className="mt-1 text-sm text-blue-600">
                        {formattedEventDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CompetitionList: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const controls = useAnimation();
  const [openCompetition, setOpenCompetition] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(4);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Return early if no data
  if (!flashEvent?.competitions) return null;

  // Add variants back
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Get active competitions
  const activeCompetitions = flashEvent.competitions.filter(comp => comp.isActive);

  // Handle load more
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 4);
  };

  // Get competitions to display
  const displayedCompetitions = activeCompetitions.slice(0, displayCount);
  const hasMore = activeCompetitions.length > displayCount;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        ref={ref}
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Header */}
        <motion.div className="max-w-3xl mx-auto text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-blue-600">Challenge</span>
          </h2>
          <p className="text-lg text-gray-600">
            Explore our diverse range of competitions and find the perfect challenge to showcase your talents
          </p>
        </motion.div>

        {/* Competition List */}
        <motion.div className="max-w-4xl mx-auto space-y-4" variants={containerVariants}>
          {displayedCompetitions.map((competition, index) => (
            <motion.div 
              key={`${competition.name}-${index}`} 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <CompetitionAccordion
                competition={competition}
                isOpen={openCompetition === index}
                onClick={() => setOpenCompetition(openCompetition === index ? null : index)}
                registrationDate={flashEvent?.eventDate || ''}
                flashEvent={flashEvent}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        {hasMore && (
          <motion.div 
            className="text-center mt-8"
            variants={itemVariants}
          >
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-300 group"
            >
              <span>
                Tampilkan Lebih Banyak ({activeCompetitions.length - displayCount} lagi)
              </span>
              <FaChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}

        {/* Completed Message */}
        {!hasMore && activeCompetitions.length > 4 && (
          <motion.div 
            className="text-center mt-8 text-gray-500"
            variants={itemVariants}
          >
            Semua kompetisi telah ditampilkan
          </motion.div>
        )}

        {/* No Competitions Message */}
        {activeCompetitions.length === 0 && (
          <motion.div 
            className="text-center mt-8 text-gray-500"
            variants={itemVariants}
          >
            Tidak ada kompetisi yang aktif saat ini
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default CompetitionList;