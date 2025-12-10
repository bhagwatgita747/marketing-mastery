import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { DeepDiveResponse, DeepDiveMode } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface DeepDivePanelProps {
  topicTitle: string;
  sectionTitle: string;
  deepDive: DeepDiveResponse | null;
  isLoading: boolean;
  error: string | null;
  currentMode: DeepDiveMode;
  onModeChange: (mode: DeepDiveMode) => void;
  onClose: () => void;
}

const modeConfig: Record<DeepDiveMode, { icon: string; label: string; description: string }> = {
  explain: {
    icon: '🔍',
    label: 'Go Deeper',
    description: 'More depth and nuance',
  },
  simpler: {
    icon: '💡',
    label: 'Simplify',
    description: 'Explain like I\'m new',
  },
  examples: {
    icon: '📚',
    label: 'Examples',
    description: 'Real-world cases',
  },
  apply: {
    icon: '🎯',
    label: 'Apply to Nivea',
    description: 'Specific to skincare',
  },
};

export function DeepDivePanel({
  topicTitle: _topicTitle,
  sectionTitle,
  deepDive,
  isLoading,
  error,
  currentMode,
  onModeChange,
  onClose,
}: DeepDivePanelProps) {
  const [activeMode, setActiveMode] = useState<DeepDiveMode>(currentMode);

  const handleModeClick = (mode: DeepDiveMode) => {
    setActiveMode(mode);
    onModeChange(mode);
  };

  return (
    <div className="mt-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔬</span>
            <div>
              <h4 className="font-semibold text-sm">Deep Dive</h4>
              <p className="text-xs text-indigo-100 truncate max-w-[200px]">{sectionTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="px-4 py-3 border-b border-indigo-200 bg-white/50">
        <p className="text-xs text-slate-500 mb-2">How would you like to explore this?</p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(modeConfig) as [DeepDiveMode, typeof modeConfig.explain][]).map(([mode, config]) => (
            <button
              key={mode}
              onClick={() => handleModeClick(mode)}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeMode === mode
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 border border-slate-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>{config.icon}</span>
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" text="Generating deep dive..." />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            <p className="font-medium">Error</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        ) : deepDive ? (
          <div className="space-y-4">
            {/* Title */}
            <div className="flex items-center gap-2">
              <span className="text-lg">{modeConfig[activeMode].icon}</span>
              <h5 className="font-semibold text-slate-800">{deepDive.title}</h5>
            </div>

            {/* Content */}
            <div className="prose prose-sm prose-slate max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="text-slate-700 mb-3 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>,
                  li: ({ children }) => <li className="text-slate-700">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                  h3: ({ children }) => <h3 className="font-semibold text-slate-800 mt-4 mb-2">{children}</h3>,
                  h4: ({ children }) => <h4 className="font-medium text-slate-800 mt-3 mb-2">{children}</h4>,
                }}
              >
                {deepDive.content}
              </ReactMarkdown>
            </div>

            {/* Follow-up Question */}
            {deepDive.followUp && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500">💭</span>
                  <div>
                    <p className="text-xs font-medium text-amber-700 mb-1">Think about it:</p>
                    <p className="text-sm text-amber-800">{deepDive.followUp}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">Select a mode above to explore this concept further</p>
          </div>
        )}
      </div>
    </div>
  );
}
