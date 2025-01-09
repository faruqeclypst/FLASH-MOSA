import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Calendar, Users } from 'lucide-react';

const CTASection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  const cardVariants = {
    hover: {
      y: -10,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
<section className="py-16 md:py-20 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
<motion.div
    className="container mx-auto px-4"
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }} // Ubah amount menjadi lebih kecil
    transition={{ duration: 0.3, delay: 0.1 }} // Tambahkan transisi yang lebih cepat
  >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl font-extrabold mb-4 text-gray-800 leading-tight font-antistar">
            Bergabung dengan <span className="text-emerald-800">Flash Celestiance</span>
          </h2>
          <div className="bg-emerald-800 w-24 h-2 mb-8 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-inter">
            Jangan lewatkan kesempatan untuk menunjukkan bakat, mengembangkan kreativitas, dan berkolaborasi dengan siswa-siswi berbakat lainnya!
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-gradient-to-br from-white to-yellow-50/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-yellow-100/50 transition-all duration-300 relative overflow-hidden group"
            variants={cardVariants}
            whileHover="hover"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-100/20 rounded-full blur-3xl group-hover:bg-yellow-100/30 transition-colors duration-300" />
            
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-yellow-100/50 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-10 h-10 text-yellow-500 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 font-antistar text-center">Kompetisi Menarik</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Ikuti berbagai lomba menarik dalam bidang bahasa dan seni untuk mengembangkan potensimu.
              </p>
            </div>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-white to-emerald-50/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-emerald-100/50 transition-all duration-300 relative overflow-hidden group"
            variants={cardVariants}
            whileHover="hover"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-100/20 rounded-full blur-3xl group-hover:bg-emerald-100/30 transition-colors duration-300" />
            
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-emerald-100/50 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-10 h-10 text-emerald-500 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 font-antistar text-center">Golden Ticket</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Dapatkan kesempatan Golden Ticket untuk menjadi siswa-siswi SMAN Modal Bangsa.
              </p>
            </div>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100/50 transition-all duration-300 relative overflow-hidden group"
            variants={cardVariants}
            whileHover="hover"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-100/20 rounded-full blur-3xl group-hover:bg-purple-100/30 transition-colors duration-300" />
            
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-purple-100/50 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-purple-500 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 font-antistar text-center">Pengalaman Berharga</h3>
              <p className="text-gray-600 leading-relaxed text-center">
                Bertemu dengan peserta berbakat dari seluruh Aceh dan mengembangkan jaringan pertemanan.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;