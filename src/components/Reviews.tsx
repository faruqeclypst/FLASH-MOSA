import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  review: string;
}

const reviewsData: Review[] = [
  {
    name: 'John Doe',
    rating: 5,
    review: 'This event was absolutely amazing! The organization was top-notch, and the content was very informative.',
  },
  {
    name: 'Jane Smith',
    rating: 4,
    review: 'I had a great time at the event. The only downside was the long queue at the registration.',
  },
  {
    name: 'Alice Johnson',
    rating: 5,
    review: 'The event exceeded my expectations. The speakers were knowledgeable, and the networking opportunities were fantastic.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

const ReviewCard: React.FC<Review> = ({ name, rating, review }) => (
  <motion.div
    className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
    variants={itemVariants}
    whileHover={{ scale: 1.03 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="flex space-x-1 mb-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-6 h-6 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
    <h4 className="text-xl font-bold mb-2 text-gray-800">{name}</h4>
    <p className="text-gray-600">{review}</p>
  </motion.div>
);

const Reviews: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl font-bold mb-6 text-gray-800 leading-tight"
            variants={itemVariants}
          >
            What People Are Saying
          </motion.h2>
          <motion.div
            className="bg-blue-600 w-24 h-2 mb-8 mx-auto"
            variants={itemVariants}
          ></motion.div>
          <motion.p
            className="text-2xl text-gray-600 max-w-4xl mx-auto"
            variants={itemVariants}
          >
            See what our attendees have to say about their experience at FLASH.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {reviewsData.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;