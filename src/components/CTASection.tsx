// File: components/CTASection.tsx

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

  return (
    <section className="py-24 bg-gradient-to-b from-blue-100 to-purple-100 overflow-hidden">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.h2 
            className="text-6xl font-bold mb-8 text-gray-800 leading-tight"
            variants={itemVariants}
          >
            Join the FLASH Experience
          </motion.h2>
          <div className="bg-blue-600 w-24 h-2 mb-8 mx-auto"></div>
          <p className="text-2xl leading-relaxed text-gray-700 mb-12 max-w-3xl mx-auto">
            Don't miss out on this incredible opportunity to showcase your talents, learn from experts, and connect with like-minded individuals!
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-8 text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Star className="w-16 h-16 text-yellow-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-4">Exciting Competitions</h3>
            <p className="text-gray-600">Participate in cutting-edge tech challenges and showcase your skills.</p>
          </motion.div>
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-8 text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Calendar className="w-16 h-16 text-green-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-4">Engaging Workshops</h3>
            <p className="text-gray-600">Learn from industry experts and enhance your knowledge in various tech domains.</p>
          </motion.div>
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-8 text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Users className="w-16 h-16 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-4">Networking Opportunities</h3>
            <p className="text-gray-600">Connect with peers, mentors, and potential employers in the tech industry.</p>
          </motion.div>
        </motion.div>

        <motion.div className="text-center" variants={itemVariants}>
          <motion.a
            href="#registration"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105"
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