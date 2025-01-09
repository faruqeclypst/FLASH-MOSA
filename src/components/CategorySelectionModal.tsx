import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SchoolCategory, Competition } from '../types';
import { FaTrophy, FaGraduationCap } from 'react-icons/fa';

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: SchoolCategory) => void;
  availableCategories: SchoolCategory[];
  competition: Competition;
}

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  availableCategories,
  competition
}) => {
  // If there's only one category, automatically select it
  useEffect(() => {
    if (isOpen && availableCategories.length === 1) {
      // Get current scroll position
      const currentScrollPosition = window.scrollY;
      
      onSelect(availableCategories[0]);
      onClose();
      
      // Maintain scroll position
      setTimeout(() => {
        window.scrollTo(0, currentScrollPosition);
      }, 0);
    }
  }, [isOpen, availableCategories]);

  // Don't render if there's only one category
  if (availableCategories.length <= 1) return null;

  const handleCategorySelect = (category: SchoolCategory) => {
    // Get current scroll position
    const currentScrollPosition = window.scrollY;
    
    onSelect(category);
    onClose();
    
    // Maintain scroll position temporarily
    window.scrollTo(0, currentScrollPosition);
    
    // Scroll to registration section after a short delay
    setTimeout(() => {
      const registrationSection = document.getElementById('registration');
      if (registrationSection) {
        registrationSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-xl overflow-hidden"
          >
            {/* Modal Content */}
            <div className="p-6">
              {/* Competition Info */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-6">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-200 to-purple-50 flex-shrink-0 flex items-center justify-center">
                  {competition.icon ? (
                    <img 
                      src={competition.icon} 
                      alt={competition.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaTrophy className="text-white text-xl opacity-75" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {competition.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {competition.type === 'team' ? 'Kompetisi Tim' : 'Kompetisi Individual'}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Pilih Kategori Pendaftaran
                </h3>
                <p className="text-gray-600 text-sm">
                  Silakan pilih kategori yang sesuai dengan tingkat pendidikan Anda
                </p>
              </div>
              
              <div className="space-y-3">
                {availableCategories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <FaGraduationCap className="text-green-800" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 block">
                          {category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {category === 'SD/MI' && 'Sekolah Dasar / Madrasah Ibtidaiyah'}
                          {category === 'SMP/MTs' && 'Sekolah Menengah Pertama / Madrasah Tsanawiyah'}
                          {category === 'SMA/SMK/MA' && 'Sekolah Menengah Atas / Kejuruan / Madrasah Aliyah'}
                          {category === 'UMUM' && 'Terbuka untuk Umum'}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <button
                onClick={onClose}
                className="mt-6 w-full p-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CategorySelectionModal; 