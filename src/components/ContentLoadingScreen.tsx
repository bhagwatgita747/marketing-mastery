import { useState, useEffect, useRef } from 'react';

interface ContentLoadingScreenProps {
  topicTitle: string;
  score: number;
}

// Number of hops in the journey
const TOTAL_HOPS = 8;
const HOP_INTERVAL = 1200; // milliseconds between hops

// Simple "pop" sound using Web Audio API
function playHopSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.1); // E6 note

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    // Audio not supported, silently fail
  }
}

// Girl Avatar SVG Component
function GirlAvatar() {
  return (
    <svg viewBox="0 0 40 50" className="w-10 h-12">
      {/* Hair */}
      <ellipse cx="20" cy="16" rx="14" ry="14" fill="#4A3728" />
      <ellipse cx="8" cy="20" rx="4" ry="6" fill="#4A3728" />
      <ellipse cx="32" cy="20" rx="4" ry="6" fill="#4A3728" />

      {/* Face */}
      <circle cx="20" cy="18" r="11" fill="#FFDAB9" />

      {/* Eyes */}
      <ellipse cx="16" cy="17" rx="2" ry="2.5" fill="#333" />
      <ellipse cx="24" cy="17" rx="2" ry="2.5" fill="#333" />
      <circle cx="16.5" cy="16.5" r="0.8" fill="#FFF" />
      <circle cx="24.5" cy="16.5" r="0.8" fill="#FFF" />

      {/* Smile */}
      <path d="M16 23 Q20 26 24 23" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <circle cx="12" cy="21" r="2" fill="#FFB6C1" opacity="0.6" />
      <circle cx="28" cy="21" r="2" fill="#FFB6C1" opacity="0.6" />

      {/* Body/Dress */}
      <path d="M12 32 L10 48 L30 48 L28 32 Q20 36 12 32" fill="#6366F1" />

      {/* Arms */}
      <ellipse cx="8" cy="38" rx="3" ry="5" fill="#FFDAB9" />
      <ellipse cx="32" cy="38" rx="3" ry="5" fill="#FFDAB9" />
    </svg>
  );
}

export function ContentLoadingScreen(_props: ContentLoadingScreenProps) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isHopping, setIsHopping] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start the hopping animation
    intervalRef.current = setInterval(() => {
      setCurrentPosition(prev => {
        const next = prev + 1;
        if (next <= TOTAL_HOPS) {
          // Trigger hop animation
          setIsHopping(true);
          setTimeout(() => setIsHopping(false), 300);

          // Play sound
          playHopSound();

          return next;
        }
        // Reset to beginning for continuous loop
        return 0;
      });
    }, HOP_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Journey Path */}
      <div className="relative w-full max-w-md mb-8">
        {/* The path line */}
        <div className="absolute top-6 left-4 right-4 h-1 bg-slate-200 rounded-full" />

        {/* Progress fill */}
        <div
          className="absolute top-6 left-4 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-300"
          style={{ width: `${(currentPosition / TOTAL_HOPS) * (100 - 4)}%` }}
        />

        {/* Milestone dots */}
        <div className="relative flex justify-between px-2">
          {Array.from({ length: TOTAL_HOPS + 1 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Dot */}
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  index < currentPosition
                    ? 'bg-primary-500 border-primary-500' // Completed
                    : index === currentPosition
                    ? 'bg-white border-primary-500 scale-125' // Current
                    : 'bg-white border-slate-300' // Upcoming
                }`}
              />
            </div>
          ))}
        </div>

        {/* Avatar positioned above current dot */}
        <div
          className="absolute -top-10 transition-all duration-300 ease-out"
          style={{
            left: `calc(${(currentPosition / TOTAL_HOPS) * 100}% - 20px + 8px)`,
            transform: isHopping ? 'translateY(-12px)' : 'translateY(0)'
          }}
        >
          <div className={`flex flex-col items-center ${isHopping ? 'animate-bounce' : ''}`}>
            <GirlAvatar />
            <span className="text-xs font-semibold text-primary-700 mt-1">Isha</span>
          </div>
        </div>
      </div>

      {/* Simple loading text */}
      <p className="text-slate-500 text-sm mt-8">Loading...</p>
    </div>
  );
}
