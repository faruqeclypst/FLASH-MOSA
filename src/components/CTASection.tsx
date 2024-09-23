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

  const cardVariants = {
    hover: {
      scale: 1.03,
      transition: {
        type: "tween",
        ease: "easeInOut",
        duration: 0.3
      }
    }
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
            className="text-4xl font-bold mb-8 text-gray-800 leading-tight"
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
            variants={cardVariants}
            whileHover="hover"
          >
            <Star className="w-16 h-16 text-yellow-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-4">Exciting Competitions</h3>
            <p className="text-gray-600">Participate in cutting-edge tech challenges and showcase your skills.</p>
          </motion.div>
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-8 text-center"
            variants={cardVariants}
            whileHover="hover"
          >
            <Calendar className="w-16 h-16 text-green-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-4">Engaging Workshops</h3>
            <p className="text-gray-600">Learn from industry experts and enhance your knowledge in various tech domains.</p>
          </motion.div>
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-8 text-center"
            variants={cardVariants}
            whileHover="hover"
          >
            <Users className="w-16 h-16 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-4">Networking Opportunities</h3>
            <p className="text-gray-600">Connect with peers, mentors, and potential employers in the tech industry.</p>
          </motion.div>
        </motion.div>

        <motion.div className="text-center" variants={itemVariants}>
          <motion.a
            href="#registration"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full hover:bg-blue-700 transition duration-300"
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











// import React from 'react';
// import { motion } from 'framer-motion';
// import { Star, MessageCircle } from 'lucide-react';

// interface Review {
//   name: string;
//   rating: number;
//   review: string;
// }

// const reviewsData: Review[] = [
//   {
//     name: 'John Doe',
//     rating: 5,
//     review: 'This event was absolutely amazing! The organization was top-notch, and the content was very informative.',
//   },
//   {
//     name: 'Jane Smith',
//     rating: 4,
//     review: 'I had a great time at the event. The only downside was the long queue at the registration.',
//   },
//   {
//     name: 'Alice Johnson',
//     rating: 5,
//     review: 'The event exceeded my expectations. The speakers were knowledgeable, and the networking opportunities were fantastic.',
//   },
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2,
//       delayChildren: 0.3,
//     },
//   },
// };

// const titleVariants = {
//   hidden: { opacity: 0, y: -50 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       type: 'spring',
//       stiffness: 100,
//       damping: 15,
//     },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, scale: 0.8, rotateY: -30 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     rotateY: 0,
//     transition: {
//       type: 'spring',
//       stiffness: 100,
//       damping: 15,
//       duration: 0.6,
//     },
//   },
//   hover: {
//     scale: 1.05,
//     rotateY: 5,
//     boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
//     transition: {
//       type: 'spring',
//       stiffness: 300,
//       damping: 10,
//     },
//   },
// };

// const ReviewCard: React.FC<Review> = ({ name, rating, review }) => (
//   <motion.div
//     className="bg-white rounded-2xl overflow-hidden shadow-lg transform perspective-1000"
//     variants={cardVariants}
//     whileHover="hover"
//   >
//     <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-24 flex items-center justify-center">
//       <MessageCircle className="w-16 h-16 text-white" />
//     </div>
//     <div className="p-8">
//       <div className="flex space-x-1 mb-4">
//         {Array.from({ length: 5 }).map((_, index) => (
//           <Star
//             key={index}
//             className={`w-6 h-6 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
//           />
//         ))}
//       </div>
//       <h4 className="text-2xl font-bold mb-4 text-gray-800">{name}</h4>
//       <p className="text-gray-600">{review}</p>
//     </div>
//   </motion.div>
// );

// const Reviews: React.FC = () => {
//   return (
//     <section className="py-24 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-hidden">
//       <motion.div
//         className="container mx-auto px-4"
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.3 }}
//       >
//         <motion.div className="text-center mb-16" variants={titleVariants}>
//           <motion.h2 
//             className="text-5xl font-extrabold mb-8 text-gray-800 leading-tight"
//             variants={titleVariants}
//           >
//             What People Are Saying About FLASH
//           </motion.h2>
//           <motion.div 
//             className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 w-32 mx-auto mb-8 rounded-full"
//             initial={{ width: 0 }}
//             animate={{ width: '8rem' }}
//             transition={{ duration: 1, delay: 0.5 }}
//           ></motion.div>
//           <motion.p 
//             className="text-2xl leading-relaxed text-gray-700 mb-12 max-w-3xl mx-auto"
//             variants={titleVariants}
//           >
//             Discover the impact FLASH has had on our attendees and why you shouldn't miss out!
//           </motion.p>
//         </motion.div>

//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-3 gap-10"
//           variants={containerVariants}
//         >
//           {reviewsData.map((review, index) => (
//             <ReviewCard key={index} {...review} />
//           ))}
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// };

// export default Reviews;