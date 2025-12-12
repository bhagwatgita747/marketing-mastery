import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ContentSection, SectionType, DeepDiveResponse, DeepDiveMode } from '../types';
import { DeepDivePanel } from './DeepDivePanel';

// Icon and color config for each section type
const sectionConfig: Record<SectionType, {
  icon: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
  darkBgColor: string;
  darkBorderColor: string;
  darkIconBg: string;
}> = {
  concept: {
    icon: '💡',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    darkBgColor: 'bg-amber-500/10',
    darkBorderColor: 'border-amber-500/20',
    darkIconBg: 'bg-amber-500/20',
  },
  why: {
    icon: '🎯',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    darkBgColor: 'bg-blue-500/10',
    darkBorderColor: 'border-blue-500/20',
    darkIconBg: 'bg-blue-500/20',
  },
  framework: {
    icon: '🔧',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    darkBgColor: 'bg-purple-500/10',
    darkBorderColor: 'border-purple-500/20',
    darkIconBg: 'bg-purple-500/20',
  },
  example: {
    icon: '🏢',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    darkBgColor: 'bg-emerald-500/10',
    darkBorderColor: 'border-emerald-500/20',
    darkIconBg: 'bg-emerald-500/20',
  },
  takeaways: {
    icon: '✅',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
    darkBgColor: 'bg-green-500/10',
    darkBorderColor: 'border-green-500/20',
    darkIconBg: 'bg-green-500/20',
  },
  challenge: {
    icon: '🏆',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconBg: 'bg-orange-100',
    darkBgColor: 'bg-orange-500/10',
    darkBorderColor: 'border-orange-500/20',
    darkIconBg: 'bg-orange-500/20',
  },
  deepdive: {
    icon: '🔬',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    iconBg: 'bg-indigo-100',
    darkBgColor: 'bg-indigo-500/10',
    darkBorderColor: 'border-indigo-500/20',
    darkIconBg: 'bg-indigo-500/20',
  },
  casestudy: {
    icon: '📊',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    iconBg: 'bg-cyan-100',
    darkBgColor: 'bg-cyan-500/10',
    darkBorderColor: 'border-cyan-500/20',
    darkIconBg: 'bg-cyan-500/20',
  },
  mistakes: {
    icon: '⚠️',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconBg: 'bg-red-100',
    darkBgColor: 'bg-red-500/10',
    darkBorderColor: 'border-red-500/20',
    darkIconBg: 'bg-red-500/20',
  },
  protips: {
    icon: '💎',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    iconBg: 'bg-violet-100',
    darkBgColor: 'bg-violet-500/10',
    darkBorderColor: 'border-violet-500/20',
    darkIconBg: 'bg-violet-500/20',
  },
};

interface SectionCardProps {
  section: ContentSection;
  index: number;
  isSaved?: boolean;
  onToggleNote?: () => void;
  // Deep Dive props
  topicTitle?: string;
  deepDive?: DeepDiveResponse | null;
  isDeepDiveLoading?: boolean;
  deepDiveError?: string | null;
  onDeepDive?: (mode: DeepDiveMode) => void;
  isDark?: boolean;
}

export function SectionCard({
  section,
  index,
  isSaved = false,
  onToggleNote,
  topicTitle,
  deepDive,
  isDeepDiveLoading = false,
  deepDiveError,
  onDeepDive,
  isDark = false,
}: SectionCardProps) {
  const config = sectionConfig[section.type] || sectionConfig.concept;
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [currentMode, setCurrentMode] = useState<DeepDiveMode>('explain');

  const handleToggleNote = () => {
    if (onToggleNote) {
      setShowSaveAnimation(true);
      onToggleNote();
      setTimeout(() => setShowSaveAnimation(false), 500);
    }
  };

  const handleDeepDiveClick = () => {
    setShowDeepDive(true);
    if (onDeepDive) {
      onDeepDive('explain');
    }
  };

  const handleModeChange = (mode: DeepDiveMode) => {
    setCurrentMode(mode);
    if (onDeepDive) {
      onDeepDive(mode);
    }
  };

  const handleCloseDeepDive = () => {
    setShowDeepDive(false);
  };

  return (
    <div
      className={`border rounded-xl p-6 mb-4 transition-all duration-200 hover:shadow-md relative group ${
        isDark
          ? `${config.darkBgColor} ${config.darkBorderColor}`
          : `${config.bgColor} ${config.borderColor}`
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header with icon and save button */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
            isDark ? config.darkIconBg : config.iconBg
          }`}>
            {config.icon}
          </div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{section.title}</h3>
        </div>

        {/* Add to Notes button */}
        {onToggleNote && (
          <button
            onClick={handleToggleNote}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              isSaved
                ? 'bg-primary-500 text-white shadow-sm'
                : isDark
                  ? 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
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
            p: ({ children }) => <p className={`mb-3 leading-relaxed ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>,
            li: ({ children }) => <li className={isDark ? 'text-white/80' : 'text-slate-700'}>{children}</li>,
            strong: ({ children }) => <strong className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{children}</strong>,
            h4: ({ children }) => <h4 className={`font-semibold mt-3 mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{children}</h4>,
          }}
        >
          {section.content}
        </ReactMarkdown>
      </div>

      {/* Deep Dive Button */}
      {onDeepDive && !showDeepDive && (
        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200/50'}`}>
          <button
            onClick={handleDeepDiveClick}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isDark
                ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10'
                : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Deep Dive - Explore Further
          </button>
        </div>
      )}

      {/* Deep Dive Panel (inline expansion) */}
      {showDeepDive && topicTitle && (
        <DeepDivePanel
          topicTitle={topicTitle}
          sectionTitle={section.title}
          deepDive={deepDive || null}
          isLoading={isDeepDiveLoading}
          error={deepDiveError || null}
          currentMode={currentMode}
          onModeChange={handleModeChange}
          onClose={handleCloseDeepDive}
          isDark={isDark}
        />
      )}
    </div>
  );
}
