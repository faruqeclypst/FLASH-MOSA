// src/components/MapLocation.tsx

import React, { useRef, useEffect, useState } from 'react';
import { Trophy, Users, Calendar } from 'lucide-react';

const MapLocation: React.FC = () => {
  const highlightRef = useRef<HTMLDivElement>(null);
  const [mapHeight, setMapHeight] = useState('400px');

  useEffect(() => {
    const updateMapHeight = () => {
      if (highlightRef.current) {
        setMapHeight(`${highlightRef.current.offsetHeight}px`);
      }
    };

    updateMapHeight();
    window.addEventListener('resize', updateMapHeight);

    return () => {
      window.removeEventListener('resize', updateMapHeight);
    };
  }, []);

  return (
    <div className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Location & Event Highlights</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div style={{ height: mapHeight, transition: 'height 0.3s ease' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.393637804538!2d95.39312037498486!3d5.50843649447156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30404789b47e89ab%3A0xb253dc7568697eaf!2sSMA%20Negeri%20Modal%20Bangsa!5e0!3m2!1sid!2sid!4v1726664140843!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>
          <div ref={highlightRef} className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6">Event Highlights</h3>
            <div className="space-y-6">
              <div className="flex items-center">
                <Trophy className="text-yellow-500 mr-4" size={24} />
                <div>
                  <p className="text-lg font-bold">10+</p>
                  <p className="text-gray-600">Awards Won</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="text-blue-500 mr-4" size={24} />
                <div>
                  <p className="text-lg font-bold">1000+</p>
                  <p className="text-gray-600">Participants</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="text-green-500 mr-4" size={24} />
                <div>
                  <p className="text-lg font-bold">August 15-17, 2023</p>
                  <p className="text-gray-600">Event Date</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-2">Address</h4>
              <p className="text-gray-600">
                Jl. Medan Merdeka Barat No.12, Gambir, Kecamatan Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10110
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;