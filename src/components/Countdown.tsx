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
      <div className="countdown-value">{value.toString().padStart(2, '0')}</div>
      <div className="countdown-label font-bold">{unit}</div>
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
    <div className="countdown-container">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <CountdownUnit key={unit} value={value} unit={unit} />
      ))}
    </div>
  );
};

export default Countdown;