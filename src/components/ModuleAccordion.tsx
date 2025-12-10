import { useState } from 'react';
import { Module, Topic } from '../types';
import { TopicRow } from './TopicRow';

// Gradient backgrounds for modules
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
}

export function ModuleAccordion({
  module,
  isBasicComplete,
  isAdvancedComplete,
  isAdvancedUnlocked,
  onTopicClick,
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
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md ${isExpanded ? 'ring-2 ring-primary-200' : ''}`}>
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          {/* Module Number Badge with gradient */}
          <div className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg transform transition-transform duration-200 ${isExpanded ? 'scale-110' : 'hover:scale-105'}`}>
            {module.module_number}
          </div>

          <div className="text-left">
            <h3 className="font-semibold text-slate-800 text-lg">{module.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-1">{module.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Ring */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative w-12 h-12">
              {/* Background circle */}
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-slate-200"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${progressPercent * 1.256} 126`}
                  className={isModuleComplete ? 'text-success-500' : 'text-primary-500'}
                  strokeLinecap="round"
                />
              </svg>
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-bold ${isModuleComplete ? 'text-success-600' : 'text-slate-600'}`}>
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Topics count */}
            <span className="text-sm text-slate-500">
              {totalTopics} topics
            </span>
          </div>

          {/* Mobile progress */}
          <div className="sm:hidden flex items-center gap-2">
            <span className={`text-sm font-medium ${isModuleComplete ? 'text-success-600' : 'text-slate-600'}`}>
              {progressPercent}%
            </span>
          </div>

          {/* Expand icon */}
          <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-primary-100 rotate-180' : ''}`}>
            <svg
              className={`w-5 h-5 ${isExpanded ? 'text-primary-600' : 'text-slate-400'}`}
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
        <div className="border-t border-slate-200 bg-gradient-to-b from-slate-50/80 to-white">
          <div className="divide-y divide-slate-100">
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
