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

// Add cache constants
const COUNTDOWN_CACHE_KEY = 'countdown_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds - shorter duration since time changes frequently

const unitLabels: { [key: string]: string } = {
  days: 'HARI',
  hours: 'JAM',
  minutes: 'MENIT',
  seconds: 'DETIK'
};

const CountdownUnit: React.FC<{ value: number; unit: string }> = ({ value, unit }) => {
  return (
    <div className="countdown-unit flex flex-col items-center">
      <div className="countdown-value text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-antistar">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="countdown-label text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold font-antistar">
        {unitLabels[unit]}
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
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventTime = new Date(eventDate).getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      }
      return null;
    };

    const loadCachedTime = () => {
      const cached = localStorage.getItem(COUNTDOWN_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired) {
          setTimeLeft(data);
          return true;
        }
        localStorage.removeItem(COUNTDOWN_CACHE_KEY);
      }
      return false;
    };

    // Initial load - try cache first
    loadCachedTime();

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
        
        // Cache the new time
        const cacheData = {
          data: newTimeLeft,
          timestamp: Date.now()
        };
        localStorage.setItem(COUNTDOWN_CACHE_KEY, JSON.stringify(cacheData));
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