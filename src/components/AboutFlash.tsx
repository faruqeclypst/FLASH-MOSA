import React from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent } from '../types';

const AboutFlash: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');

  if (!flashEvent) return null;

  return (
    <section id="about" className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">What's FLASH</h2>
        <div className="max-w-5xl text-center mx-auto">
          <p className="text-lg leading-relaxed">{flashEvent.aboutFlash}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutFlash;