import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import rocketAnimation from '../assets/rocket.json';
import { TierInfo } from '../types';
import { TIER_CONFIG, getTierForScore, getNextTier, getTopicsToNextTier, getRandomLoadingMessage } from '../lib/tiers';

interface ContentLoadingScreenProps {
  topicTitle: string;
  score: number; // Total score (basic + advanced completions)
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

  // Calculate progress within current tier
  const tierProgress = nextTier
    ? ((score - currentTier.minTopics) / (nextTier.minTopics - currentTier.minTopics)) * 100
    : 100;

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {/* Lottie Rocket Animation */}
      <div className="w-40 h-40 mb-4">
        <Lottie
          animationData={rocketAnimation}
          loop={true}
          style={{ width: '100%', height: '100%' }}
        />
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
