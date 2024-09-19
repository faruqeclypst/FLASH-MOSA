import React from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FlashActivities: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');

  if (!flashEvent) return null;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">FLASH Activities</h2>
        <Slider {...sliderSettings}>
          {flashEvent.activities.map((activity, index) => (
            <div key={index} className="px-2">
              <div className="bg-gray-100 rounded-lg p-6 h-[400px] flex flex-col">
                <img 
                  src={activity.image} 
                  alt={activity.name} 
                  className="w-full h-48 object-cover rounded-lg mb-4" 
                />
                <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
                <p>{activity.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FlashActivities;

// import React from 'react';
// import { useFirebase } from '../hooks/useFirebase';
// import { FlashEvent } from '../types';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// const FlashActivities: React.FC = () => {
//   const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');

//   if (!flashEvent) return null;

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   };

//   // Dummy images for testing
//   const dummyImages = [
//     'https://via.placeholder.com/400x300?text=Image+1',
//     'https://via.placeholder.com/400x300?text=Image+2',
//     'https://via.placeholder.com/400x300?text=Image+3',
//   ];

//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto">
//         <h2 className="text-3xl font-bold mb-8 text-center">FLASH Activities</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {flashEvent.activities.map((activity, index) => (
//             <div key={index} className="bg-gray-100 rounded-lg p-6">
//               <Slider {...sliderSettings}>
//                 {/* Use activity.image and dummy images */}
//                 <div>
//                   <img src={activity.image} alt={activity.name} className="w-full h-48 object-cover rounded-lg" />
//                 </div>
//                 {dummyImages.map((img, i) => (
//                   <div key={i}>
//                     <img src={img} alt={`Dummy ${i+1}`} className="w-full h-48 object-cover rounded-lg" />
//                   </div>
//                 ))}
//               </Slider>
//               <h3 className="text-xl font-bold my-4">{activity.name}</h3>
//               <p>{activity.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FlashActivities;