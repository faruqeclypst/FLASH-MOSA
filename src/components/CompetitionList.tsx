import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  FaPenAlt,
  FaWhatsapp,
  FaChevronDown
} from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import CategorySelectionModal from './CategorySelectionModal';
import BSILogo from '../assets/img/BSI.png';
import { CheckCircle } from 'lucide-react';

// Komponen untuk tampilan accordion
const CompetitionAccordion: React.FC<{ 
  competition: Competition, 
  isOpen: boolean, 
  onClick: (e: React.MouseEvent) => void,
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
  const [showWhatsAppDropdown, setShowWhatsAppDropdown] = useState<boolean>(false);

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

  // Tambahkan useEffect dan useRef untuk click outside handler
  const [dropdownStates, setDropdownStates] = useState<{ [key: string]: boolean }>({});
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(dropdownRefs.current).forEach(([key, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setDropdownStates(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden">
        <div 
          onClick={onClick}
          className={`cursor-pointer transition-all duration-300 ${
            isOpen 
              ? 'bg-gradient-to-r from-emerald-50 to-purple-50' 
              : 'hover:bg-gradient-to-r hover:from-emerald-50 hover:to-purple-50'
          }`}
        >
          <div className="flex items-center p-4 sm:p-6">
            {/* Icon/Image */}
            <div className="w-20 h-20 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-green-200 to-purple-200 flex-shrink-0">
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
              <h3 className="font-bold text-xl text-gray-800 mb-1 font-antistar">
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
                  <p className="text-gray-600 font-inter">{competition.description}</p>
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
                <div className="flex flex-wrap w-full gap-3">
                  <div className="flex-1 min-w-[140px]">
                  {competition.documentUrl && (
                    <a
                      href={competition.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 hover:text-red-800 transition-all duration-300"
                    >
                      <FaFilePdf className="mr-2" />
                      Juknis Lomba
                    </a>
                  )}
                  </div>
                  
                  {/* WhatsApp Button */}
                  <div className="flex-1 min-w-[140px]">
                    {competition.whatsappGroups && competition.whatsappGroups.length > 0 && (
                      <div 
                        className="relative w-full"
                        ref={el => dropdownRefs.current[competition.name] = el}
                      >
                        {competition.whatsappGroups.length === 1 ? (
                          // Single WhatsApp group - direct link
                          <a
                            href={competition.whatsappGroups[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 hover:text-green-800 transition-all duration-300"
                          >
                            <FaWhatsapp className="mr-2" />
                            Grup WA
                          </a>
                        ) : (
                          // Multiple WhatsApp groups - dropdown
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDropdownStates(prev => ({
                                  ...prev,
                                  [competition.name]: !prev[competition.name]
                                }));
                              }}
                              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 hover:text-green-800 transition-all duration-300"
                            >
                              <FaWhatsapp className="mr-2" />
                              Grup WA
                              <FaChevronDown className={`ml-2 transition-transform duration-200 ${
                                dropdownStates[competition.name] ? 'rotate-180' : ''
                              }`} size={12} />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownStates[competition.name] && (
                              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                                {competition.whatsappGroups.map((group) => (
                                  <a
                                    key={group.category}
                                    href={group.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <FaWhatsapp className="text-green-600" />
                                    <span>Grup {group.category}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Register Button */}
                {isRegistrationOpen && (
                  <div className="mt-4">
                    <motion.button
                      onClick={handleRegister}
                      className="w-full inline-flex items-center justify-center px-4 py-3.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-green-200 font-medium"
                      animate={{
                        x: [0, -5, 5, -5, 5, 0],
                        transition: {
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 3
                        }
                      }}
                    >
                      <FaPenAlt className="mr-2 text-lg" />
                      <span className="font-normal text-base">Daftar Sekarang!</span>
                    </motion.button>
                  </div>
                )}

                {/* Rules */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Info & Persyaratan</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {competition.rules?.map((rule, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-800">{idx + 1}</span>
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
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <FaClock className="text-purple-700 mt-1 flex-shrink-0" />
                      <div className="ml-2">
                        <h4 className="font-medium text-purple-700">Tanggal Pelaksanaan</h4>
                        <p className="mt-1 text-sm text-purple-600">
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

// Add cache constants
const COMPETITIONS_CACHE_KEY = 'competitions_cache';
const CACHE_DURATION = 2 * 60 * 60 * 1000; // ubah angka 2 jadi 24 kalau mau 24 hours in milliseconds

const CompetitionList: React.FC = () => {
  const { data: firebaseData } = useFirebase<FlashEvent>('flashEvent');
  const [cachedData, setCachedData] = useState<FlashEvent | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const loadMoreRef = useRef(null);
  const controls = useAnimation();
  const [openCompetition, setOpenCompetition] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(4);
  const isMobile = window.innerWidth < 768;
  const [sortedCompetitions, setSortedCompetitions] = useState<Competition[]>([]);

  // Add caching logic
  useEffect(() => {
    const loadCachedData = () => {
      const cached = localStorage.getItem(COMPETITIONS_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired) {
          setCachedData(data);
          return true;
        }
        localStorage.removeItem(COMPETITIONS_CACHE_KEY);
      }
      return false;
    };

    // Try to load from cache first
    const hasCachedData = loadCachedData();

    // If we have new Firebase data and no valid cache, update cache
    if (firebaseData && !hasCachedData) {
      const cacheData = {
        data: firebaseData,
        timestamp: Date.now()
      };
      localStorage.setItem(COMPETITIONS_CACHE_KEY, JSON.stringify(cacheData));
      setCachedData(firebaseData);
    }
  }, [firebaseData]);

  // Update sorting to use cached data
  useEffect(() => {
    const data = cachedData || firebaseData;
    if (data?.competitions) {
      const sorted = [...data.competitions].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setSortedCompetitions(sorted);
    }
  }, [cachedData, firebaseData]);

  // Tambahkan useEffect untuk Intersection Observer load more
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && isMobile && sortedCompetitions?.length > displayCount) {
        setTimeout(() => {
          setDisplayCount(prev => Math.min(prev + 2, sortedCompetitions.length));
        }, 300);
      }
    }, options);

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [displayCount, isMobile, sortedCompetitions.length]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Use cached data if available, otherwise fallback to firebase data
  const flashEvent = cachedData || firebaseData;
  if (!flashEvent?.competitions) return null;

  // Gunakan sortedCompetitions dari state
  const displayedCompetitions = sortedCompetitions.slice(0, isMobile ? displayCount : sortedCompetitions.length);
  const hasMore = isMobile && sortedCompetitions.length > displayCount;

  // Update pembagian kolom
  const leftCompetitions = displayedCompetitions.filter((_, i) => i % 2 === 0);
  const rightCompetitions = displayedCompetitions.filter((_, i) => i % 2 === 1);

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
          <motion.h2 className="text-3xl font-bold text-gray-900 mb-6 font-antistar">
            Choose Your <span className="text-green-800">Challenge</span>
          </motion.h2>
          <p className="text-base text-gray-600">
            Explore our diverse range of competitions and find the perfect challenge to showcase your talents
          </p>
        </motion.div>

        {/* Layout yang diperbarui */}
        <div className="max-w-7xl mx-auto">
          {/* Desktop: Two Column Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-4">
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
                    onClick={(e) => {
                      e.preventDefault();
                      const currentPosition = window.scrollY;
                      setOpenCompetition(openCompetition === index * 2 ? null : index * 2);
                      setTimeout(() => {
                        window.scrollTo(0, currentPosition);
                      }, 0);
                    }}
                    registrationPeriod={flashEvent?.registrationPeriod || { startDate: '', endDate: '' }}
                    flashEvent={flashEvent}
                  />
                </motion.div>
              ))}
            </div>
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
                    onClick={(e) => {
                      e.preventDefault();
                      const currentPosition = window.scrollY;
                      setOpenCompetition(openCompetition === index * 2 + 1 ? null : index * 2 + 1);
                      setTimeout(() => {
                        window.scrollTo(0, currentPosition);
                      }, 0);
                    }}
                    registrationPeriod={flashEvent?.registrationPeriod || { startDate: '', endDate: '' }}
                    flashEvent={flashEvent}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: Single Column Layout */}
          <div className="md:hidden space-y-4">
            {displayedCompetitions.map((competition, index) => (
              <motion.div 
                key={`mobile-${competition.name}-${index}`} 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <CompetitionAccordion
                  competition={competition}
                  isOpen={openCompetition === index}
                  onClick={(e) => {
                    e.preventDefault();
                    const currentPosition = window.scrollY;
                    setOpenCompetition(openCompetition === index ? null : index);
                    setTimeout(() => {
                      window.scrollTo(0, currentPosition);
                    }, 0);
                  }}
                  registrationPeriod={flashEvent?.registrationPeriod || { startDate: '', endDate: '' }}
                  flashEvent={flashEvent}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Load More Indicator - Mobile Only */}
        {isMobile && hasMore && (
          <motion.div 
            ref={loadMoreRef}
            className="text-center mt-8 md:hidden"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Scroll untuk melihat lebih banyak
            </p>
          </motion.div>
        )}

        {/* Completed Message - Mobile Only */}
        {isMobile && !hasMore && flashEvent.competitions.length > 4 && (
          <motion.div 
            className="text-center mt-6 text-sm text-gray-500 md:hidden"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Semua kompetisi telah ditampilkan</span>
            </div>
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