import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Star } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  content: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Budi Santoso",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    content: "FLASH adalah pengalaman yang luar biasa! Kompetisinya menantang dan workshopnya sangat informatif."
  },
  {
    id: 2,
    name: "Siti Nurhayati",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 4,
    content: "Saya belajar banyak di FLASH. Kesempatan networking sangat berharga untuk karir saya."
  },
  {
    id: 3,
    name: "Agus Setiawan",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    content: "Organisasi FLASH sangat bagus. Setiap aspek acara direncanakan dan dilaksanakan dengan sempurna."
  },
  {
    id: 4,
    name: "Rina Wulandari",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
    content: "FLASH melampaui semua harapan saya. Kualitas pembicara dan berbagai topik yang dibahas sangat mengesankan."
  },
  {
    id: 5,
    name: "Adi Nugroho",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    content: "Workshop praktis di FLASH sangat membantu. Saya mendapatkan keterampilan praktis yang bisa langsung saya terapkan dalam pekerjaan saya."
  },
  {
    id: 6,
    name: "Dewi Lestari",
    avatar: "https://i.pravatar.cc/150?img=6",
    rating: 5,
    content: "FLASH adalah acara yang luar biasa! Saya sangat terkesan dengan keragaman topik dan kualitas presentasi."
  },
  {
    id: 7,
    name: "Doni Kusuma",
    avatar: "https://i.pravatar.cc/150?img=7",
    rating: 4,
    content: "Sesi networking di FLASH membuka banyak peluang baru untuk saya. Sangat berharga untuk karir saya."
  },
  {
    id: 8,
    name: "Lina Wijaya",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    content: "Kompetisi di FLASH sangat menantang dan menyenangkan. Saya belajar banyak dari peserta lain."
  },
  {
    id: 9,
    name: "Tono Prasetyo",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 4,
    content: "Workshop praktis di FLASH sangat membantu. Saya mendapatkan keterampilan baru yang dapat langsung saya terapkan."
  },
  {
    id: 10,
    name: "Eka Putri",
    avatar: "https://i.pravatar.cc/150?img=10",
    rating: 5,
    content: "Pembicara tamu di FLASH sangat menginspirasi. Saya pulang dengan banyak ide baru untuk proyek saya."
  },
  {
    id: 11,
    name: "Rudi Hermawan",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    content: "FLASH memberikan wawasan yang luar biasa tentang tren terbaru dalam industri. Sangat bermanfaat untuk pengembangan profesional saya."
  },
  {
    id: 12,
    name: "Olivia Sari",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 4,
    content: "Saya sangat menikmati sesi tanya jawab dengan para ahli di FLASH. Mereka sangat terbuka dan informatif."
  },
  {
    id: 13,
    name: "Dani Gunawan",
    avatar: "https://i.pravatar.cc/150?img=13",
    rating: 5,
    content: "Fasilitas dan organisasi FLASH sangat mengesankan. Setiap detail diperhatikan dengan baik."
  },
  {
    id: 14,
    name: "Sari Indah",
    avatar: "https://i.pravatar.cc/150?img=14",
    rating: 4,
    content: "FLASH memberikan platform yang luar biasa untuk bertukar ide dengan rekan-rekan dari seluruh dunia."
  },
  {
    id: 15,
    name: "Candra Wijaya",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 5,
    content: "Saya sangat merekomendasikan FLASH kepada siapa pun yang ingin memperluas pengetahuan dan jaringan mereka dalam industri ini."
  },
  {
    id: 16,
    name: "Firman Saputra",
    avatar: "https://i.pravatar.cc/150?img=16",
    rating: 5,
    content: "FLASH SMAN Modal Bangsa adalah acara yang sangat inspiratif! Pembicara tamunya luar biasa dan topik-topiknya sangat relevan."
  },
  {
    id: 17,
    name: "Yuni Kartika",
    avatar: "https://i.pravatar.cc/150?img=17",
    rating: 4,
    content: "Saya sangat menikmati kompetisi di FLASH SMAN Modal Bangsa. Sangat menantang dan memacu semangat."
  },
  {
    id: 18,
    name: "Andi Firmansyah",
    avatar: "https://i.pravatar.cc/150?img=18",
    rating: 5,
    content: "FLASH SMAN Modal Bangsa memberikan saya banyak pengetahuan baru. Workshop-nya sangat informatif dan bermanfaat."
  },
  {
    id: 19,
    name: "Rina Permata",
    avatar: "https://i.pravatar.cc/150?img=19",
    rating: 4,
    content: "Kesempatan networking di FLASH SMAN Modal Bangsa sangat berharga. Saya bertemu banyak profesional yang inspiratif."
  },
  {
    id: 20,
    name: "Fajar Hidayat",
    avatar: "https://i.pravatar.cc/150?img=20",
    rating: 5,
    content: "FLASH SMAN Modal Bangsa sangat mengesankan! Semua aspek acara direncanakan dan dilaksanakan dengan sempurna."
  }
];

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <motion.div 
    className="bg-white p-6 rounded-xl mb-6 shadow-md"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-start mb-4">
      <img src={review.avatar} alt={review.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
      <div className="flex-grow">
        <h3 className="font-bold text-xl text-gray-800 mb-1">{review.name}</h3>
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill="currentColor" 
            />
          ))}
        </div>
        <p className="text-gray-600 leading-relaxed">{review.content}</p>
      </div>
    </div>
  </motion.div>
);

const Reviews: React.FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileReviews, setMobileReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (isMobile) {
      const shuffledReviews = [...reviews].sort(() => Math.random() - 0.5);
      setMobileReviews(shuffledReviews.slice(0, 10));
    }
  }, [isMobile]);

  useEffect(() => {
    const scrollAnimation = async () => {
      if (isMobile) {
        await controls1.start({
          y: [0, -1000, 0],
          transition: {
            y: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          },
        });
      } else {
        const containerHeight = containerRef.current?.offsetHeight || 0;
        const viewportHeight = 500;
        const scrollDistance = containerHeight - viewportHeight;

        controls1.start({
          y: [0, -scrollDistance, 0],
          transition: {
            y: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 230,
              ease: "linear",
            },
          },
        });
        controls2.start({
          y: [-scrollDistance, 0, -scrollDistance],
          transition: {
            y: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 120,
              ease: "linear",
            },
          },
        });
      }
    };

    scrollAnimation();
  }, [controls1, controls2, isMobile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-5xl font-extrabold mb-4 text-gray-800 leading-tight"
            variants={itemVariants}
          >
            Apa kata <span className="text-blue-600">Mereka</span>
          </motion.h2>
          <motion.div className="bg-blue-600 w-24 h-2 mb-8 mx-auto rounded-full" variants={itemVariants}></motion.div>
          <motion.p 
            className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
             Mereka yang telah mengikuti event FLASH secara langsung
          </motion.p>
        </motion.div>

        <div className="relative overflow-hidden" style={{ height: '500px' }}>
          {isMobile ? (
            <motion.div 
              className="grid grid-cols-1 gap-6"
              animate={controls1}
            >
              {mobileReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-6" ref={containerRef}>
              <motion.div animate={controls1}>
                {reviews.slice(0, 10).map((review) => (
                  <ReviewCard key={`${review.id}-1`} review={review} />
                ))}
              </motion.div>
              <motion.div animate={controls2}>
                {reviews.slice(10, 20).map((review) => (
                  <ReviewCard key={`${review.id}-2`} review={review} />
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;