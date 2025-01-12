import React, { useState, useRef, useEffect } from 'react';
import { FaMusic, FaVolumeMute } from 'react-icons/fa';

interface BackgroundMusicProps {
  audioSource: string;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ audioSource }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      audioElement.volume = 1;
      
      const playPromise = audioElement.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Autoplay started successfully');
            setIsPlaying(true);
          })
          .catch(error => {
            console.log('Autoplay prevented:', error);
            setIsPlaying(false);
          });
      }
    }
  }, [audioSource]);

  const togglePlay = async () => {
    if (audioRef.current && !error) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error toggling audio:', err);
        }
        setIsPlaying(false);
      }
    }
  };

  if (error) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-purple-600 rounded-full blur-md opacity-75" />
        <button
          onClick={togglePlay}
          className="relative p-3 bg-gradient-to-r from-emerald-900 to-purple-900 
                   rounded-full flex items-center justify-center
                   shadow-xl shadow-emerald-900/30
                   border border-white/10
                   transition-all duration-300 transform hover:scale-110"
          aria-label={isPlaying ? 'Mute music' : 'Play music'}
        >
          {isPlaying ? (
            <FaVolumeMute className="w-6 h-6 text-emerald-50" />
          ) : (
            <FaMusic className="w-6 h-6 text-emerald-50" />
          )}
        </button>
      </div>
      <audio ref={audioRef} loop preload="auto">
        <source src={audioSource} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default BackgroundMusic; 