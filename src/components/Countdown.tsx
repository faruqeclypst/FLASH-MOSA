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
    <div className="countdown-unit flex flex-col items-center">
      <div className="countdown-value text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="countdown-label text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold">
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
    <div className="countdown-container flex flex-row justify-center items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6 xl:space-x-8 my-2 sm:my-4 md:my-6 lg:my-8 xl:my-10 text-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <CountdownUnit key={unit} value={value} unit={unit} />
      ))}
    </div>
  );
};

export default Countdown;