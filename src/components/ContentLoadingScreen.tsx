import { useState, useEffect } from 'react';
import { TierInfo } from '../types';
import { TIER_CONFIG, getTierForScore, getNextTier, getTopicsToNextTier, getRandomLoadingMessage } from '../lib/tiers';

interface ContentLoadingScreenProps {
  topicTitle: string;
  score: number; // Total score (basic + advanced completions)
}

// Animated Rocket SVG Component
function AnimatedRocket() {
  return (
    <div className="relative w-32 h-32">
      {/* Rocket with bobbing animation */}
      <div className="absolute inset-0 animate-bounce" style={{ animationDuration: '2s' }}>
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg">
          {/* Rocket body */}
          <ellipse cx="32" cy="28" rx="10" ry="18" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
          {/* Rocket tip */}
          <path d="M32 8 L26 20 L38 20 Z" fill="#ef4444" />
          {/* Window */}
          <circle cx="32" cy="24" r="5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1"/>
          <circle cx="33" cy="23" r="2" fill="#93c5fd" opacity="0.6"/>
          {/* Fins */}
          <path d="M22 38 L18 48 L26 42 Z" fill="#ef4444" />
          <path d="M42 38 L46 48 L38 42 Z" fill="#ef4444" />
          {/* Center fin */}
          <path d="M32 42 L29 52 L35 52 Z" fill="#dc2626" />
        </svg>
      </div>

      {/* Flame effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8">
        <div className="flex justify-center gap-0.5">
          <div className="w-2 h-8 bg-gradient-to-t from-yellow-500 via-orange-500 to-transparent rounded-full animate-pulse" style={{ animationDuration: '0.3s' }}/>
          <div className="w-3 h-10 bg-gradient-to-t from-yellow-400 via-orange-400 to-transparent rounded-full animate-pulse" style={{ animationDuration: '0.2s' }}/>
          <div className="w-2 h-8 bg-gradient-to-t from-yellow-500 via-orange-500 to-transparent rounded-full animate-pulse" style={{ animationDuration: '0.4s' }}/>
        </div>
      </div>

      {/* Sparkles/stars */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDuration: '1.5s' }}/>
      <div className="absolute top-8 right-4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}/>
      <div className="absolute bottom-12 left-4 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{ animationDuration: '1.8s', animationDelay: '0.3s' }}/>
    </div>
  );
}

export function ContentLoadingScreen({ topicTitle, score }: ContentLoadingScreenProps) {
  const [loadingMessage, setLoadingMessage] = useState(getRandomLoadingMessage());
  const currentTier = getTierForScore(score);
  const nextTier = getNextTier(currentTier.tier);
  const topicsToNext = getTopicsToNextTier(score);

  // Rotate loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessage(getRandomLoadingMessage());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {/* Animated Rocket */}
      <div className="mb-6">
        <AnimatedRocket />
      </div>

      {/* Loading Message */}
      <p className="text-lg font-medium text-slate-700 mb-2 text-center animate-pulse">
        {loadingMessage}
      </p>

      {/* Topic Being Loaded */}
      <p className="text-sm text-slate-500 mb-6 text-center">
        Loading: <span className="font-medium text-primary-600">{topicTitle}</span>
      </p>

      {/* Tier Progress Section */}
      <div className="w-full max-w-md bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        {/* Current Tier Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">{currentTier.emoji}</span>
          <span className={`font-semibold ${currentTier.color}`}>{currentTier.label}</span>
        </div>

        {/* Tier Progress Bar */}
        <div className="relative mb-3">
          {/* Tier markers */}
          <div className="flex justify-between mb-1">
            {TIER_CONFIG.map((tier: TierInfo, index: number) => (
              <div
                key={tier.tier}
                className={`flex flex-col items-center ${
                  index === 0 ? 'items-start' : index === TIER_CONFIG.length - 1 ? 'items-end' : ''
                }`}
              >
                <span className="text-lg">{tier.emoji}</span>
              </div>
            ))}
          </div>

          {/* Progress bar background */}
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            {/* Progress fill */}
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min((score / 144) * 100, 100)}%` }}
            />
          </div>

          {/* Tier dividers */}
          <div className="absolute top-6 left-0 right-0 flex justify-between px-0">
            {TIER_CONFIG.slice(1).map((tier: TierInfo) => (
              <div
                key={tier.tier}
                className="w-0.5 h-3 bg-slate-400"
                style={{ marginLeft: `${(tier.minTopics / 144) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Progress Text */}
        {nextTier ? (
          <p className="text-center text-sm text-slate-600">
            <span className="font-semibold text-primary-600">{topicsToNext}</span> more completions to{' '}
            <span className={`font-semibold ${nextTier.color}`}>
              {nextTier.emoji} {nextTier.label}
            </span>
          </p>
        ) : (
          <p className="text-center text-sm text-slate-600 font-semibold">
            You've reached the highest tier! Keep learning!
          </p>
        )}
      </div>

      {/* Motivational tip */}
      <p className="mt-4 text-xs text-slate-400 text-center italic">
        Every topic you complete brings you closer to marketing mastery
      </p>
    </div>
  );
}
