import React from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FlashActivities: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');

  if (!flashEvent) return null;

  const CustomPrevArrow = (props: any) => (
    <button
      {...props}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg"
    >
      <ChevronLeft size={24} className="text-blue-600" />
    </button>
  );

  const CustomNextArrow = (props: any) => (
    <button
      {...props}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg"
    >
      <ChevronRight size={24} className="text-blue-600" />
    </button>
  );

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

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
    <section className="py-24 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h2 
            className="text-6xl font-bold mb-8 text-gray-800 leading-tight"
            variants={itemVariants}
          >
            FLASH Activities
          </motion.h2>
          <div className="bg-blue-600 w-24 h-2 mb-8 mx-auto"></div>
          <p className="text-2xl leading-relaxed text-gray-700 mb-8 max-w-3xl mx-auto">
            Immerse yourself in a world of innovation and creativity with our exciting FLASH activities
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Slider {...sliderSettings}>
            {flashEvent.activities.map((activity, index) => (
              <div key={index} className="px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="relative h-96">
                    <img 
                      src={activity.image} 
                      alt={activity.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-4xl font-bold text-white mb-4">{activity.name}</h3>
                      <p className="text-xl text-gray-200">{activity.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FlashActivities;