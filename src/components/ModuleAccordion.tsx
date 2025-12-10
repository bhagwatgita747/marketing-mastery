import { useState } from 'react';
import { Module, Topic } from '../types';
import { TopicRow } from './TopicRow';
import { ProgressBar } from './ProgressBar';

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Module Number Badge */}
          <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center font-bold text-lg">
            {module.module_number}
          </div>

          <div className="text-left">
            <h3 className="font-semibold text-slate-800">{module.title}</h3>
            <p className="text-sm text-slate-500">{module.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="hidden sm:block w-32">
            <ProgressBar value={totalCompleted} max={totalPossible} size="sm" />
          </div>

          {/* Topics count */}
          <span className="text-sm text-slate-500">
            {totalTopics} topics
          </span>

          {/* Expand icon */}
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Topics List - Expandable */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50/50">
          <div className="divide-y divide-slate-100">
            {module.topics.map((topic) => (
              <TopicRow
                key={topic.id}
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
