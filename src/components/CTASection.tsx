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
          <h2 className="text-5xl font-extrabold mb-4 text-gray-800 leading-tight">
            Join The <span className="text-blue-600">FLASH</span> Experience
          </h2>
          <div className="bg-blue-600 w-24 h-2 mb-8 mx-auto rounded-full"></div>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Don't miss out on this incredible opportunity to showcase your talents, learn from experts, and connect with like-minded individuals!
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 transition-all duration-300"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Star className="w-10 h-10 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Exciting Competitions</h3>
            <p className="text-gray-600 leading-relaxed">Participate in cutting-edge tech challenges and showcase your skills on a global stage.</p>
          </motion.div>
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 transition-all duration-300"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Calendar className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Engaging Workshops</h3>
            <p className="text-gray-600 leading-relaxed">Learn from industry experts and enhance your knowledge in various cutting-edge tech domains.</p>
          </motion.div>
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 transition-all duration-300"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Users className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Networking Opportunities</h3>
            <p className="text-gray-600 leading-relaxed">Connect with peers, mentors, and potential employers in the rapidly evolving tech industry.</p>
          </motion.div>
        </motion.div>

        <motion.div className="text-center" variants={itemVariants}>
          <motion.a
            href="#registration"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register Now
            <ArrowRight className="ml-2" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;