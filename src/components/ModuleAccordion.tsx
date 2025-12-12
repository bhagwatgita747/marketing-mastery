import { useState } from 'react';
import { Module, Topic } from '../types';
import { TopicRow } from './TopicRow';

// Clean gradient backgrounds for modules
const MODULE_GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-teal-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-green-500 to-emerald-600',
  'from-amber-500 to-orange-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
];

interface ModuleAccordionProps {
  module: Module;
  isBasicComplete: (topicId: string) => boolean;
  isAdvancedComplete: (topicId: string) => boolean;
  isAdvancedUnlocked: (topicId: string) => boolean;
  onTopicClick: (topic: Topic, level: 'basic' | 'advanced') => void;
  isDark?: boolean;
}

export function ModuleAccordion({
  module,
  isBasicComplete,
  isAdvancedComplete,
  isAdvancedUnlocked,
  onTopicClick,
  isDark = false,
}: ModuleAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate completion stats
  const totalTopics = module.topics.length;
  const completedBasic = module.topics.filter(t => isBasicComplete(t.id)).length;
  const completedAdvanced = module.topics.filter(t => isAdvancedComplete(t.id)).length;
  const totalCompleted = completedBasic + completedAdvanced;
  const totalPossible = totalTopics * 2;
  const progressPercent = Math.round((totalCompleted / totalPossible) * 100);
  const isModuleComplete = totalCompleted === totalPossible;

  const gradientClass = MODULE_GRADIENTS[module.module_number % MODULE_GRADIENTS.length];

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
      isDark
        ? 'glass hover:bg-white/[0.06]'
        : 'bg-white shadow-acctual hover:shadow-acctual-md'
    }`}>
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-5 py-4 flex items-center justify-between transition-all duration-200 ${
          isDark
            ? 'hover:bg-white/[0.02]'
            : 'hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Module Number Badge with gradient */}
          <div className={`w-11 h-11 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center font-bold text-base text-white shadow-sm transform transition-transform duration-200 ${isExpanded ? 'scale-105' : ''}`}>
            {module.module_number}
          </div>

          <div className="text-left">
            <h3 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-black'}`}>
              {module.title}
            </h3>
            <p className={`text-sm line-clamp-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
              {module.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress display */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Mini progress bar */}
            <div className="w-20">
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-medium ${
                  isModuleComplete
                    ? isDark ? 'text-accent-400' : 'text-accent-600'
                    : isDark ? 'text-white/50' : 'text-black/50'
                }`}>
                  {progressPercent}%
                </span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${
                isDark ? 'bg-white/10' : 'bg-slate-100'
              }`}>
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isModuleComplete
                      ? 'bg-accent-500'
                      : isDark ? 'bg-primary-400' : 'bg-primary-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Topics count */}
            <span className={`text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              {totalTopics} topics
            </span>
          </div>

          {/* Mobile progress */}
          <div className="sm:hidden flex items-center gap-2">
            <span className={`text-sm font-medium ${
              isModuleComplete
                ? isDark ? 'text-accent-400' : 'text-accent-600'
                : isDark ? 'text-white/50' : 'text-black/50'
            }`}>
              {progressPercent}%
            </span>
          </div>

          {/* Expand icon */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isExpanded
              ? isDark ? 'bg-accent-500/20 rotate-180' : 'bg-accent-100 rotate-180'
              : isDark ? 'bg-white/10' : 'bg-slate-100'
          }`}>
            <svg
              className={`w-4 h-4 ${
                isExpanded
                  ? isDark ? 'text-accent-400' : 'text-accent-600'
                  : isDark ? 'text-white/40' : 'text-black/40'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Topics List - Expandable with animation */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`border-t ${
          isDark
            ? 'border-white/[0.06] bg-black/20'
            : 'border-slate-100 bg-slate-50/50'
        }`}>
          <div className={`divide-y ${isDark ? 'divide-white/[0.04]' : 'divide-slate-100'}`}>
            {module.topics.map((topic, index) => (
              <div
                key={topic.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TopicRow
                  topic={topic}
                  isBasicComplete={isBasicComplete(topic.id)}
                  isAdvancedComplete={isAdvancedComplete(topic.id)}
                  isAdvancedUnlocked={isAdvancedUnlocked(topic.id)}
                  onBasicClick={() => onTopicClick(topic, 'basic')}
                  onAdvancedClick={() => {
                    if (isAdvancedUnlocked(topic.id)) {
                      onTopicClick(topic, 'advanced');
                    }
                  }}
                  isDark={isDark}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
