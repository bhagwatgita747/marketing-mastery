import { TierInfo, MarketingTier } from '../types';

// Total topics in curriculum (9 modules × 8 topics each)
export const TOTAL_TOPICS = 72;

// Tier thresholds (based on completed topics - both basic and advanced count)
// Max score = 72 topics × 2 (basic + advanced) = 144 points
export const TIER_CONFIG: TierInfo[] = [
  {
    tier: 'bronze',
    label: 'Bronze Marketer',
    emoji: '🥉',
    minTopics: 0,
    maxTopics: 35,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  {
    tier: 'silver',
    label: 'Silver Marketer',
    emoji: '🥈',
    minTopics: 36,
    maxTopics: 71,
    color: 'text-slate-600',
    bgColor: 'bg-slate-200',
  },
  {
    tier: 'gold',
    label: 'Gold Marketer',
    emoji: '🥇',
    minTopics: 72,
    maxTopics: 107,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    tier: 'diamond',
    label: 'Diamond Marketer',
    emoji: '💎',
    minTopics: 108,
    maxTopics: 144,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
  },
];

export function getTierForScore(score: number): TierInfo {
  for (let i = TIER_CONFIG.length - 1; i >= 0; i--) {
    if (score >= TIER_CONFIG[i].minTopics) {
      return TIER_CONFIG[i];
    }
  }
  return TIER_CONFIG[0];
}

export function getNextTier(currentTier: MarketingTier): TierInfo | null {
  const index = TIER_CONFIG.findIndex(t => t.tier === currentTier);
  if (index < TIER_CONFIG.length - 1) {
    return TIER_CONFIG[index + 1];
  }
  return null;
}

export function getTopicsToNextTier(score: number): number {
  const currentTier = getTierForScore(score);
  const nextTier = getNextTier(currentTier.tier);
  if (!nextTier) return 0;
  return nextTier.minTopics - score;
}

// Calculate score from progress map
// Basic completion = 1 point, Advanced completion = 1 point (total 2 per topic)
export function calculateScore(progress: Map<string, { basic_completed: boolean; advanced_completed: boolean }>): number {
  let score = 0;
  progress.forEach((p) => {
    if (p.basic_completed) score += 1;
    if (p.advanced_completed) score += 1;
  });
  return score;
}

// Motivational messages during loading
export const LOADING_MESSAGES = [
  "Isha's marketing skills leveling up...",
  "Brewing knowledge for you...",
  "Unlocking marketing secrets...",
  "Preparing your next breakthrough...",
  "Loading your path to mastery...",
  "Gathering expert insights...",
  "Your marketing journey continues...",
  "Building your competitive edge...",
];

export function getRandomLoadingMessage(): string {
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
}
