import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Topic, Content } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { SectionCard } from './SectionCard';

interface ContentModalProps {
  topic: Topic;
  level: 'basic' | 'advanced';
  content: Content | null;
  isLoading: boolean;
  error: string | null;
  isComplete: boolean;
  onClose: () => void;
  onMarkComplete: () => Promise<void>;
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
}: ContentModalProps) {
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Check if we have structured content
  const hasStructuredContent = content?.structured?.sections && content.structured.sections.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Wide layout for better reading */}
      <div className="relative w-full h-full md:h-[90vh] md:max-w-5xl lg:max-w-6xl md:mx-4 bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Reading Progress Bar */}
        {!isLoading && content && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-150"
              style={{ width: `${readProgress}%` }}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                level === 'basic'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {level === 'basic' ? 'Basic' : 'Advanced'}
              </span>
              {isComplete && (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completed
                </span>
              )}
              {!isLoading && content && (
                <span className="text-xs text-slate-400 ml-2">
                  {readProgress}% read
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-slate-800">{topic.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 md:px-10 lg:px-14 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" text="Generating content with AI..." />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
              <p className="font-medium">Error loading content</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : content ? (
            hasStructuredContent ? (
              // Render structured sections as cards
              <div className="max-w-3xl mx-auto">
                {content.structured!.sections.map((section, index) => (
                  <SectionCard key={index} section={section} index={index} />
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
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              {hasStructuredContent
                ? `${content.structured!.sections.length} sections`
                : level === 'basic' ? '~5 min read' : '~8-10 min read'
              }
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>

              {!isComplete && (
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
