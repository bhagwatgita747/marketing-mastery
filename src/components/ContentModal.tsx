import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Topic, Content, SectionType, ContentSection, DeepDiveMode, DeepDiveResponse } from '../types';
import { SectionCard } from './SectionCard';
import { useDeepDive } from '../hooks/useDeepDive';
import { useTheme } from '../hooks/useTheme';
import { ContentLoadingScreen } from './ContentLoadingScreen';

interface ContentModalProps {
  topic: Topic;
  level: 'basic' | 'advanced';
  content: Content | null;
  isLoading: boolean;
  error: string | null;
  isComplete: boolean;
  onClose: () => void;
  onMarkComplete: () => Promise<void>;
  onTakeQuiz?: () => void;
  onMemorize?: () => void;
  // Notes functionality
  isNoteSaved?: (sectionType: SectionType) => boolean;
  onToggleNote?: (sectionType: SectionType, sectionTitle: string, content: string) => void;
  totalSavedNotes?: number;
  onViewNotes?: () => void;
  // Progress/tier score
  progressScore?: number;
  // Streaming sections (appear progressively while loading)
  streamingSections?: ContentSection[];
}

export function ContentModal({
  topic,
  level,
  content,
  isLoading,
  error,
  isComplete,
  onClose,
  onMarkComplete,
  onTakeQuiz,
  onMemorize,
  isNoteSaved,
  onToggleNote,
  totalSavedNotes = 0,
  onViewNotes,
  progressScore = 0,
  streamingSections = [],
}: ContentModalProps) {
  const { isDark } = useTheme();
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Deep Dive state
  const { generateDeepDive, isGenerating: isDeepDiveLoading, error: deepDiveError } = useDeepDive();
  const [deepDiveData, setDeepDiveData] = useState<Record<number, DeepDiveResponse | null>>({});
  const [activeDeepDiveSection, setActiveDeepDiveSection] = useState<number | null>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Track reading progress
  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentEl;
      const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
      setReadProgress(isNaN(progress) ? 0 : progress);
    };

    contentEl.addEventListener('scroll', handleScroll);
    return () => contentEl.removeEventListener('scroll', handleScroll);
  }, [content]);

  const handleMarkComplete = async () => {
    setIsMarkingComplete(true);
    try {
      await onMarkComplete();
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // Deep Dive handler
  const handleDeepDive = async (sectionIndex: number, sectionTitle: string, sectionContent: string, mode: DeepDiveMode) => {
    setActiveDeepDiveSection(sectionIndex);
    const result = await generateDeepDive(topic.title, sectionTitle, sectionContent, mode);
    if (result) {
      setDeepDiveData(prev => ({ ...prev, [sectionIndex]: result }));
    }
  };

  // Check if we have structured content
  const hasStructuredContent = content?.structured?.sections && content.structured.sections.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 backdrop-blur-sm ${isDark ? 'bg-black/70' : 'bg-black/50'}`}
        onClick={onClose}
      />

      {/* Modal - Wide layout for better reading */}
      <div className={`relative w-full h-full md:h-[90vh] md:max-w-5xl lg:max-w-6xl md:mx-4 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0f0f1a]' : 'bg-white'
      }`}>
        {/* Reading Progress Bar */}
        {!isLoading && content && (
          <div className={`absolute top-0 left-0 right-0 h-1 z-10 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-150"
              style={{ width: `${readProgress}%` }}
            />
          </div>
        )}

        {/* Header */}
        <div className={`flex-shrink-0 px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                level === 'basic'
                  ? isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                  : isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
              }`}>
                {level === 'basic' ? 'Basic' : 'Advanced'}
              </span>
              {isComplete && (
                <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completed
                </span>
              )}
              {!isLoading && content && (
                <span className={`text-xs ml-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                  {readProgress}% read
                </span>
              )}
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{topic.title}</h2>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className={`flex-1 overflow-y-auto px-6 md:px-10 lg:px-14 py-8 ${
          isDark ? 'bg-[#0f0f1a]' : ''
        }`}>
          {/* Show loading screen only when loading AND no streaming sections yet */}
          {isLoading && streamingSections.length === 0 ? (
            <ContentLoadingScreen topicTitle={topic.title} score={progressScore} isDark={isDark} />
          ) : error ? (
            <div className={`px-4 py-3 rounded-lg ${
              isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-600'
            }`}>
              <p className="font-medium">Error loading content</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : isLoading && streamingSections.length > 0 ? (
            // Streaming mode: show sections as they arrive
            <div className="max-w-3xl mx-auto">
              {streamingSections.map((section, index) => (
                <SectionCard
                  key={`streaming-${index}`}
                  section={section}
                  index={index}
                  isSaved={isNoteSaved ? isNoteSaved(section.type) : false}
                  onToggleNote={onToggleNote ? () => onToggleNote(section.type, section.title, section.content) : undefined}
                  topicTitle={topic.title}
                  deepDive={deepDiveData[index]}
                  isDeepDiveLoading={isDeepDiveLoading && activeDeepDiveSection === index}
                  deepDiveError={activeDeepDiveSection === index ? deepDiveError : null}
                  onDeepDive={(mode) => handleDeepDive(index, section.title, section.content, mode)}
                  isDark={isDark}
                />
              ))}
              {/* Loading indicator for more sections */}
              <div className={`flex items-center justify-center gap-3 py-8 ${
                isDark ? 'text-white/50' : 'text-slate-400'
              }`}>
                <div className="flex gap-1">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-accent-400' : 'bg-accent-500'}`} style={{ animationDelay: '0ms' }} />
                  <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-accent-400' : 'bg-accent-500'}`} style={{ animationDelay: '150ms' }} />
                  <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-accent-400' : 'bg-accent-500'}`} style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">Loading more sections...</span>
              </div>
            </div>
          ) : content ? (
            hasStructuredContent ? (
              // Render structured sections as cards
              <div className="max-w-3xl mx-auto">
                {content.structured!.sections.map((section, index) => (
                  <SectionCard
                    key={index}
                    section={section}
                    index={index}
                    isSaved={isNoteSaved ? isNoteSaved(section.type) : false}
                    onToggleNote={onToggleNote ? () => onToggleNote(section.type, section.title, section.content) : undefined}
                    // Deep Dive props
                    topicTitle={topic.title}
                    deepDive={deepDiveData[index]}
                    isDeepDiveLoading={isDeepDiveLoading && activeDeepDiveSection === index}
                    deepDiveError={activeDeepDiveSection === index ? deepDiveError : null}
                    onDeepDive={(mode) => handleDeepDive(index, section.title, section.content, mode)}
                    isDark={isDark}
                  />
                ))}
              </div>
            ) : (
              // Fallback to raw markdown
              <div className="markdown-content prose prose-slate max-w-3xl mx-auto">
                <ReactMarkdown>{content.content}</ReactMarkdown>
              </div>
            )
          ) : null}
        </div>

        {/* Footer */}
        {!isLoading && content && (
          <div className={`flex-shrink-0 px-6 py-4 border-t flex items-center justify-between ${
            isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center gap-4">
              <span className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {hasStructuredContent
                  ? `${content.structured!.sections.length} sections`
                  : level === 'basic' ? '~5 min read' : '~8-10 min read'
                }
              </span>
              {totalSavedNotes > 0 && onViewNotes && (
                <button
                  onClick={onViewNotes}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isDark
                      ? 'text-primary-400 hover:text-primary-300 hover:bg-primary-500/10'
                      : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  {totalSavedNotes} {totalSavedNotes === 1 ? 'note' : 'notes'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isDark ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Close
              </button>

              {!isComplete ? (
                <button
                  onClick={handleMarkComplete}
                  disabled={isMarkingComplete}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isMarkingComplete ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Complete
                    </>
                  )}
                </button>
              ) : (
                <>
                  {onMemorize && (
                    <button
                      onClick={onMemorize}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                        isDark
                          ? 'bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 border border-accent-500/30'
                          : 'bg-accent-50 text-accent-700 hover:bg-accent-100 border border-accent-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Memorize This
                    </button>
                  )}
                  {onTakeQuiz && (
                    <button
                      onClick={onTakeQuiz}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Take Quiz
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
