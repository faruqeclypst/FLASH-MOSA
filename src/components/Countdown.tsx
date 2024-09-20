// src/components/Countdown.tsx
import React, { useState, useEffect } from 'react';
import '../styles/countdown.css';

interface CountdownProps {
  eventDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownUnit: React.FC<{ value: number; unit: string }> = ({ value, unit }) => {
  return (
    <div className="countdown-unit">
      <div className="countdown-value text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="countdown-label text-xs sm:text-sm md:text-base lg:text-lg font-bold">
        {unit}
      </div>
    </div>
  );
};

const Countdown: React.FC<CountdownProps> = ({ eventDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = new Date(eventDate).getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <div className="countdown-container flex justify-center items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 my-4 sm:my-6 md:my-8 lg:my-10">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <CountdownUnit key={unit} value={value} unit={unit} />
      ))}
    </div>
  );
};

export default Countdown;