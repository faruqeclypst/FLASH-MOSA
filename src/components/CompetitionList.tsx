import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Competition } from '../types';
import { useInView } from 'react-intersection-observer';
import { FaUsers, FaTrophy, FaCheckCircle } from 'react-icons/fa';

const CompetitionCard: React.FC<{ competition: Competition }> = ({ competition }) => {
  const renderTeamSize = () => {
    if (competition.type === 'single') {
      return 'Individual';
    } else if (competition.teamSize) {
      return `${competition.teamSize} Players`;
    } else {
      return 'Team';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform transition duration-300 hover:scale-105">
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        {competition.icon ? (
          <img 
            src={competition.icon} 
            alt={`${competition.name} icon`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaTrophy className="text-6xl text-white opacity-20" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{competition.name}</h3>
          <div className="flex items-center text-white text-sm">
            <FaUsers className="mr-2" />
            <span>{renderTeamSize()}</span>
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-gray-600 text-sm mb-4 flex-grow">{competition.description}</p>
        <div className="mt-auto">
          <h4 className="font-semibold text-lg mb-3 text-gray-800">Rules:</h4>
          <ul className="space-y-2">
            {competition.rules?.map((rule, ruleIndex) => (
              <li key={ruleIndex} className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
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
  const [isMobile, setIsMobile] = useState(false);
  const [visibleItems, setVisibleItems] = useState(6);
  const [animateNewItems, setAnimateNewItems] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      setVisibleItems(isMobileDevice ? 3 : 6);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  if (!flashEvent || !flashEvent.competitions) return null;

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

  const loadMore = () => {
    setVisibleItems(prevVisibleItems => {
      const increment = isMobile ? 3 : 6;
      return Math.min(prevVisibleItems + increment, flashEvent.competitions.length);
    });
    setAnimateNewItems(true);
    setTimeout(() => setAnimateNewItems(false), 100);
  };

  return (
    <section id="competitions" className="py-24 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <motion.div
        ref={ref}
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-5xl font-extrabold mb-4 text-gray-800 leading-tight">
            Our Exciting <span className="text-blue-600">Competitions</span>
          </h2>
          <div className="bg-blue-600 w-24 h-2 mb-8 mx-auto rounded-full"></div>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Showcase your skills and compete with the best in our thrilling challenges
          </p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {flashEvent.competitions.slice(0, visibleItems).map((competition, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants} 
              className="h-full"
              initial={animateNewItems && index >= visibleItems - (isMobile ? 3 : 6) ? "hidden" : "visible"}
              animate="visible"
            >
              <CompetitionCard competition={competition} />
            </motion.div>
          ))}
        </motion.div>
        {visibleItems < flashEvent.competitions.length && (
          <motion.div 
            className="text-center mt-16"
            variants={itemVariants}
          >
            <button
              onClick={loadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              Load More Competitions
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default CompetitionList;