import React, { useEffect, useState, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Competition, SchoolCategory } from '../types';
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
  FaImage,
  FaPenAlt
} from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import CategorySelectionModal from './CategorySelectionModal';
import BSILogo from '../assets/img/BSI.png';

// Komponen untuk tampilan accordion
const CompetitionAccordion: React.FC<{ 
  competition: Competition, 
  isOpen: boolean, 
  onClick: () => void,
  registrationPeriod: { startDate: string; endDate: string; },
  flashEvent: FlashEvent | null
}> = ({ 
  competition, 
  isOpen, 
  onClick,
  registrationPeriod,
  flashEvent
}) => {
  const today = new Date();
  const endDate = new Date(registrationPeriod.endDate);
  const startDate = new Date(registrationPeriod.startDate);
  
  const isRegistrationOpen = today >= startDate && today <= endDate && competition.isActive;
  const isRegistrationNotStarted = today < startDate;
  const isRegistrationEnded = today > endDate;

  const getRegistrationStatus = () => {
    if (!competition.isActive) return { text: 'Pendaftaran Ditutup', color: 'orange' };
    if (isRegistrationNotStarted) return { text: 'Pendaftaran Belum Dibuka', color: 'yellow' };
    if (isRegistrationEnded) return { text: 'Periode Pendaftaran Berakhir', color: 'red' };
    return { text: 'Pendaftaran Dibuka', color: 'green' };
  };

  const status = getRegistrationStatus();

  // Format tanggal
  const formattedRegistrationDate = registrationPeriod.startDate ? format(new Date(registrationPeriod.startDate), 'd MMMM yyyy', { locale: id }) : '-';
  const formattedEventDate = competition.eventDate ? format(new Date(competition.eventDate), 'd MMMM yyyy', { locale: id }) : '-';
  
  // Add state for modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Modify handleRegister
  const handleRegister = (e: React.MouseEvent) => {
    // Prevent default behavior and propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Get current scroll position
    const currentScrollPosition = window.scrollY;
    
    // Show category modal
    setShowCategoryModal(true);
    
    // Maintain scroll position
    setTimeout(() => {
      window.scrollTo(0, currentScrollPosition);
    }, 0);
  };

  // Add handleCategorySelect
  const handleCategorySelect = (category: SchoolCategory) => {
    setShowCategoryModal(false);
    
    // Dispatch custom event without updating URL
    const event = new CustomEvent('competitionSelected', {
      detail: { 
        competition: competition.name, 
        category,
        shouldScroll: true
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden">
        <div 
          onClick={onClick}
          className={`cursor-pointer transition-all duration-300 ${
            isOpen ? 'bg-blue-50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center p-4 sm:p-6">
            {/* Icon/Image */}
            <div className="w-20 h-20 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-200 to-purple-50 flex-shrink-0">
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
            <div className="ml-4 flex-grow min-h-[80px]">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {competition.name}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {/* Status badge */}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  status.color === 'green' ? 'bg-green-50 text-green-700' :
                  status.color === 'orange' ? 'bg-orange-50 text-orange-700' :
                  status.color === 'yellow' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {status.text}
                </span>
                
                {/* Other badges */}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  competition.type === 'team' 
                    ? 'bg-purple-50 text-purple-700'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {competition.type === 'team' ? 'Tim' : 'Individu'}
                </span>
                {competition.categories?.map((category, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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

                {/* Registration Fee */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  {/* Fee Information */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Biaya Pendaftaran</h4>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {competition.type === 'team' ? 'Per Tim' : 'Per Orang'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-gray-900">
                        {competition.registrationFee ? (
                          `Rp ${competition.registrationFee.toLocaleString('id-ID')}`
                        ) : (
                          'Gratis'
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Bank Information */}
                  {competition.registrationFee > 0 && (
                    <>
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                        <img 
                          src={BSILogo}
                          alt="Bank BSI" 
                          className="h-8 object-contain"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Bank Syariah Indonesia (BSI)</p>
                          <p className="text-sm text-gray-600">Pembayaran hanya melalui BSI</p>
                        </div>
                      </div>

                      {competition.bankAccount && (
                        <div className="mt-2 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-gray-500">Nomor Rekening</p>
                              <p className="text-base font-medium text-gray-900">
                                {competition.bankAccount.number}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Atas Nama</p>
                              <p className="text-base font-medium text-gray-900">
                                {competition.bankAccount.holder}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Document and Logo Buttons */}
                <div className="flex flex-wrap justify-center w-full gap-3">
                  {competition.documentUrl && (
                    <a
                      href={competition.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 hover:text-red-800 transition-all duration-300"
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

                {/* Register Button */}
                {isRegistrationOpen && (
                  <div className="mt-4">
                    <motion.button
                      onClick={handleRegister}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-300"
                      animate={{
                        x: [0, -5, 5, -5, 5, 0],
                        transition: {
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 3
                        }
                      }}
                    >
                      <FaPenAlt className="mr-2" />
                      <span className="font-normal">Daftar Sekarang!</span>
                    </motion.button>
                  </div>
                )}

                {/* Rules */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Info & Persyaratan</h4>
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
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-green-600">
                            Mulai: {format(new Date(registrationPeriod.startDate), 'd MMMM yyyy', { locale: id })}
                          </p>
                          <p className="text-sm text-green-600">
                            Berakhir: {format(new Date(registrationPeriod.endDate), 'd MMMM yyyy', { locale: id })}
                          </p>
                        </div>
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

      {/* Add CategorySelectionModal */}
      <CategorySelectionModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSelect={handleCategorySelect}
        availableCategories={competition.categories || []}
        competition={competition}
      />
    </>
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
  const isMobile = window.innerWidth < 768; // Check if mobile

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  if (!flashEvent?.competitions) return null;

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

  // Get competitions to display for mobile
  const displayedCompetitions = isMobile ? 
    flashEvent.competitions.slice(0, displayCount) :
    flashEvent.competitions;

  const hasMore = isMobile && flashEvent.competitions.length > displayCount;

  // Split competitions into columns
  const leftCompetitions = isMobile ?
    displayedCompetitions.filter((_, i) => i % 2 === 0) :
    flashEvent.competitions.filter((_, i) => i % 2 === 0);

  const rightCompetitions = isMobile ? 
    displayedCompetitions.filter((_, i) => i % 2 === 1) :
    flashEvent.competitions.filter((_, i) => i % 2 === 1);

  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentScrollPosition = window.scrollY;
    setDisplayCount(prev => prev + 4);
    setTimeout(() => {
      window.scrollTo(0, currentScrollPosition);
    }, 0);
  };

  return (
    <section id="competitions" className="py-16 md:py-24 bg-gradient-to-b from-gray-100 to-white">
      <motion.div
        ref={ref}
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Header */}
        <motion.div className="max-w-3xl mx-auto text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-blue-600">Challenge</span>
          </h2>
          <p className="text-base text-gray-600">
            Explore our diverse range of competitions and find the perfect challenge to showcase your talents
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {leftCompetitions.map((competition, index) => (
              <motion.div 
                key={`left-${competition.name}-${index}`} 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <CompetitionAccordion
                  competition={competition}
                  isOpen={openCompetition === index * 2}
                  onClick={() => setOpenCompetition(openCompetition === index * 2 ? null : index * 2)}
                  registrationPeriod={flashEvent?.registrationPeriod || { startDate: '', endDate: '' }}
                  flashEvent={flashEvent}
                />
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightCompetitions.map((competition, index) => (
              <motion.div 
                key={`right-${competition.name}-${index}`} 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <CompetitionAccordion
                  competition={competition}
                  isOpen={openCompetition === index * 2 + 1}
                  onClick={() => setOpenCompetition(openCompetition === index * 2 + 1 ? null : index * 2 + 1)}
                  registrationPeriod={flashEvent?.registrationPeriod || { startDate: '', endDate: '' }}
                  flashEvent={flashEvent}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Load More Button - Mobile Only */}
        {hasMore && (
          <motion.div 
            className="text-center mt-8 md:hidden px-4"
            variants={itemVariants}
          >
            <button
              onClick={handleLoadMore}
              className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 shadow-sm"
            >
              <span className="text-sm font-medium">
                Lihat {flashEvent.competitions.length - displayCount} Kompetisi Lainnya
              </span>
              <FaChevronRight className="text-gray-400 text-xs" />
            </button>
          </motion.div>
        )}

        {/* Completed Message - Mobile Only */}
        {isMobile && !hasMore && flashEvent.competitions.length > 4 && (
          <motion.div 
            className="text-center mt-6 text-sm text-gray-500 md:hidden"
            variants={itemVariants}
          >
            Semua kompetisi telah ditampilkan
          </motion.div>
        )}

        {/* No Competitions Message */}
        {flashEvent.competitions.length === 0 && (
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