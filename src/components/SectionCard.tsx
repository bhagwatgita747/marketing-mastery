import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ContentSection, SectionType } from '../types';

// Icon and color config for each section type
const sectionConfig: Record<SectionType, { icon: string; bgColor: string; borderColor: string; iconBg: string }> = {
  concept: {
    icon: '💡',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
  },
  why: {
    icon: '🎯',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
  },
  framework: {
    icon: '🔧',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
  },
  example: {
    icon: '🏢',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
  },
  takeaways: {
    icon: '✅',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
  },
  challenge: {
    icon: '🏆',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconBg: 'bg-orange-100',
  },
  deepdive: {
    icon: '🔬',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    iconBg: 'bg-indigo-100',
  },
  casestudy: {
    icon: '📊',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    iconBg: 'bg-cyan-100',
  },
  mistakes: {
    icon: '⚠️',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconBg: 'bg-red-100',
  },
  protips: {
    icon: '💎',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    iconBg: 'bg-violet-100',
  },
};

interface SectionCardProps {
  section: ContentSection;
  index: number;
  isSaved?: boolean;
  onToggleNote?: () => void;
}

export function SectionCard({ section, index, isSaved = false, onToggleNote }: SectionCardProps) {
  const config = sectionConfig[section.type] || sectionConfig.concept;
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  const handleToggleNote = () => {
    if (onToggleNote) {
      setShowSaveAnimation(true);
      onToggleNote();
      setTimeout(() => setShowSaveAnimation(false), 500);
    }
  };

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6 mb-4 transition-all duration-200 hover:shadow-md relative group`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header with icon and save button */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`${config.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
            {config.icon}
          </div>
          <h3 className="text-lg font-semibold text-slate-800">{section.title}</h3>
        </div>

        {/* Add to Notes button */}
        {onToggleNote && (
          <button
            onClick={handleToggleNote}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              isSaved
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-primary-600 border border-slate-200'
            } ${showSaveAnimation ? 'animate-bounce-in' : ''}`}
            title={isSaved ? 'Remove from notes' : 'Save to notes'}
          >
            {isSaved ? (
              <>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save
              </>
            )}
          </button>
        )}
      </div>

      {/* Saved indicator badge */}
      {isSaved && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
      )}

      {/* Content */}
      <div className="prose prose-slate prose-sm max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="text-slate-700 mb-3 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>,
            li: ({ children }) => <li className="text-slate-700">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
            h4: ({ children }) => <h4 className="font-semibold text-slate-800 mt-3 mb-2">{children}</h4>,
          }}
        >
          {section.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
