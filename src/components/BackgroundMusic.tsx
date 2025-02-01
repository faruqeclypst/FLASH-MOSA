import React, { useState, useRef, useEffect } from 'react';
import { FaMusic, FaVolumeMute } from 'react-icons/fa';

interface BackgroundMusicProps {
  audioSource: string;
}

// Cache key for localStorage
const AUDIO_CACHE_KEY = 'background_music_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ audioSource }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState(false);
  const [cachedAudioUrl, setCachedAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadAndCacheAudio = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(AUDIO_CACHE_KEY);
        if (cached) {
          const { url, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > CACHE_DURATION;
          
          if (!isExpired) {
            setCachedAudioUrl(url);
            return;
          }
          localStorage.removeItem(AUDIO_CACHE_KEY);
        }

        // If no cache or expired, fetch and cache the audio
        const response = await fetch(audioSource);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        // Cache the audio URL
        const cacheData = {
          url,
          timestamp: Date.now()
        };
        localStorage.setItem(AUDIO_CACHE_KEY, JSON.stringify(cacheData));
        setCachedAudioUrl(url);
      } catch (err) {
        console.error('Error caching audio:', err);
        setError(true);
      }
    };

    loadAndCacheAudio();

    // Cleanup function
    return () => {
      if (cachedAudioUrl) {
        URL.revokeObjectURL(cachedAudioUrl);
      }
    };
  }, [audioSource]);

  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement && cachedAudioUrl) {
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
  }, [cachedAudioUrl]);

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
        <source src={cachedAudioUrl || audioSource} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default BackgroundMusic; 