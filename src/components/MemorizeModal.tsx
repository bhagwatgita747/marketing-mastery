/**
 * MemorizeModal - Main component for "Memorize This Easily" feature
 * Allows users to practice verbal recall of content they just learned
 */

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useMemorize, useMemorizeOnboarding } from '../hooks/useMemorize';
import { useSpeechRecognition, formatTime } from '../hooks/useSpeechRecognition';
import { MemorizeOnboarding } from './MemorizeOnboarding';
import { LoadingSpinner } from './LoadingSpinner';
import { Topic, Content, MemorizeResult } from '../types';

interface MemorizeModalProps {
  topic: Topic;
  level: 'basic' | 'advanced';
  content: Content;
  onClose: () => void;
}

type ModalState = 'onboarding' | 'idle' | 'recording' | 'analyzing' | 'results';

export function MemorizeModal({ topic, level, content, onClose }: MemorizeModalProps) {
  const { isDark } = useTheme();
  const { hasSeenOnboarding, markOnboardingComplete } = useMemorizeOnboarding();

  // Determine initial state
  const [modalState, setModalState] = useState<ModalState>(
    hasSeenOnboarding ? 'idle' : 'onboarding'
  );

  // Hooks
  const {
    keywords,
    isExtractingKeywords,
    extractKeywordsFromContent,
    result,
    isAnalyzing: _isAnalyzing,
    analyzeUserTranscript,
    error: memorizeError,
    reset: resetMemorize,
  } = useMemorize();

  const {
    isListening: _isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    elapsedTime,
  } = useSpeechRecognition();

  // Suppress unused variable warnings (used for state tracking)
  void _isAnalyzing;
  void _isListening;

  // Extract keywords when modal opens
  useEffect(() => {
    if (content.structured && modalState !== 'onboarding') {
      extractKeywordsFromContent(content.structured);
    }
  }, [content.structured, extractKeywordsFromContent, modalState]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalState !== 'recording') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, modalState]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = useCallback(() => {
    markOnboardingComplete();
    setModalState('idle');
    if (content.structured) {
      extractKeywordsFromContent(content.structured);
    }
  }, [markOnboardingComplete, content.structured, extractKeywordsFromContent]);

  // Handle start recording
  const handleStartRecording = useCallback(() => {
    if (!isSupported) {
      return;
    }
    resetTranscript();
    startListening();
    setModalState('recording');
  }, [isSupported, resetTranscript, startListening]);

  // Handle stop recording and analyze
  const handleStopAndAnalyze = useCallback(async () => {
    stopListening();
    setModalState('analyzing');

    if (content.structured) {
      await analyzeUserTranscript(content.structured, keywords, transcript);
      setModalState('results');
    }
  }, [stopListening, content.structured, analyzeUserTranscript, keywords, transcript]);

  // Handle try again
  const handleTryAgain = useCallback(() => {
    resetMemorize();
    resetTranscript();
    setModalState('idle');
    if (content.structured) {
      extractKeywordsFromContent(content.structured);
    }
  }, [resetMemorize, resetTranscript, content.structured, extractKeywordsFromContent]);

  const error = memorizeError || speechError;

  // Show onboarding for first-time users
  if (modalState === 'onboarding') {
    return (
      <MemorizeOnboarding
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 backdrop-blur-sm ${isDark ? 'bg-black/70' : 'bg-black/50'}`}
        onClick={modalState !== 'recording' ? onClose : undefined}
      />

      {/* Modal */}
      <div className={`relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl md:mx-4 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0f0f1a]' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex-shrink-0 px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                isDark ? 'bg-accent-500/20 text-accent-400' : 'bg-accent-100 text-accent-700'
              }`}>
                Memorize
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                level === 'basic'
                  ? isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                  : isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
              }`}>
                {level === 'basic' ? 'Basic' : 'Advanced'}
              </span>
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {topic.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={modalState === 'recording'}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-50'
                : 'hover:bg-slate-100 text-slate-500 disabled:opacity-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto px-6 py-8 ${isDark ? 'bg-[#0f0f1a]' : ''}`}>
          {/* Browser not supported warning */}
          {!isSupported && (
            <div className={`mb-6 p-4 rounded-xl ${
              isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="flex items-start gap-3">
                <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className={`font-medium ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                    Speech recognition not supported
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>
                    This feature works best in Chrome or Edge. Please open this page in one of those browsers to use voice recording.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className={`mb-6 p-4 rounded-xl ${
              isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
            </div>
          )}

          {/* Idle / Ready state */}
          {modalState === 'idle' && (
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                isDark ? 'bg-accent-500/20' : 'bg-accent-100'
              }`}>
                <svg className={`w-8 h-8 ${isDark ? 'text-accent-400' : 'text-accent-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>

              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Explain these concepts
              </h3>
              <p className={`text-sm mb-8 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                Speak about what you learned. No pressure - just explain in your own words!
              </p>

              {/* Keywords */}
              {isExtractingKeywords ? (
                <div className="flex justify-center mb-8">
                  <LoadingSpinner size="sm" text="Extracting key concepts..." />
                </div>
              ) : keywords.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {keywords.map((keyword, index) => (
                    <div
                      key={keyword}
                      className={`px-4 py-2 rounded-full text-sm font-medium animate-scale-in ${
                        isDark
                          ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white border border-white/10'
                          : 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border border-primary-200'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Start recording button */}
              <button
                onClick={handleStartRecording}
                disabled={!isSupported || isExtractingKeywords || keywords.length === 0}
                className={`px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isDark
                    ? 'bg-gradient-to-r from-accent-500 to-emerald-500 hover:from-accent-400 hover:to-emerald-400 shadow-lg shadow-accent-500/25'
                    : 'bg-gradient-to-r from-accent-500 to-emerald-500 hover:from-accent-600 hover:to-emerald-600 shadow-lg'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  Start Recording
                </span>
              </button>

              <p className={`text-xs mt-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Talk naturally for up to 4 minutes
              </p>
            </div>
          )}

          {/* Recording state */}
          {modalState === 'recording' && (
            <div className="text-center">
              {/* Keywords reminder - shown during recording */}
              <p className={`text-sm mb-3 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                Explain these concepts:
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {keywords.map((keyword) => (
                  <div
                    key={keyword}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      isDark
                        ? 'bg-white/10 text-white/80 border border-white/20'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {keyword}
                  </div>
                ))}
              </div>

              {/* Recording indicator */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className={`absolute inset-0 rounded-full animate-ping ${
                  isDark ? 'bg-red-400/30' : 'bg-red-500/30'
                }`} />
                <div className={`absolute inset-2 rounded-full animate-pulse ${
                  isDark ? 'bg-red-400/50' : 'bg-red-500/50'
                }`} />
                <div className={`relative w-full h-full rounded-full flex items-center justify-center ${
                  isDark ? 'bg-red-500' : 'bg-red-500'
                }`}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Timer */}
              <div className={`text-2xl font-mono font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {formatTime(elapsedTime)}
              </div>
              <p className={`text-xs mb-4 ${isDark ? 'text-red-400' : 'text-red-500'}`}>
                🔴 Recording...
              </p>

              {/* Live transcript preview */}
              {(transcript || interimTranscript) && (
                <div className={`max-h-24 overflow-y-auto p-3 rounded-xl text-left text-sm mb-4 ${
                  isDark ? 'bg-white/5 text-white/80' : 'bg-slate-50 text-slate-600'
                }`}>
                  {transcript}
                  <span className={isDark ? 'text-white/40' : 'text-slate-400'}>{interimTranscript}</span>
                </div>
              )}

              {/* Stop button */}
              <button
                onClick={handleStopAndAnalyze}
                className={`px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                  isDark
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400'
                    : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  Stop & Analyze
                </span>
              </button>
            </div>
          )}

          {/* Analyzing state */}
          {modalState === 'analyzing' && (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" text="Analyzing your explanation..." />
            </div>
          )}

          {/* Results state */}
          {modalState === 'results' && result && (
            <ResultsView
              result={result}
              isDark={isDark}
              onTryAgain={handleTryAgain}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Star rating component
function StarRating({ rating, isDark }: { rating: number; isDark: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-yellow-400'
              : isDark ? 'text-white/20' : 'text-slate-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Results view component
interface ResultsViewProps {
  result: MemorizeResult;
  isDark: boolean;
  onTryAgain: () => void;
  onClose: () => void;
}

function ResultsView({ result, isDark, onTryAgain, onClose }: ResultsViewProps) {
  const percentage = Math.round((result.score / result.maxScore) * 100);
  const averageRating = result.overallRating;

  // Get emoji and label based on overall rating
  const getScoreInfo = () => {
    if (averageRating >= 5) return { emoji: '🏆', label: 'Outstanding!', color: 'text-yellow-500' };
    if (averageRating >= 4) return { emoji: '🎉', label: 'Excellent!', color: 'text-green-500' };
    if (averageRating >= 3) return { emoji: '👍', label: 'Good effort!', color: 'text-blue-500' };
    if (averageRating >= 2) return { emoji: '💪', label: 'Keep going!', color: 'text-orange-500' };
    return { emoji: '📚', label: 'Time to review!', color: 'text-red-500' };
  };

  const scoreInfo = getScoreInfo();

  // Check if there are concepts that need review
  const conceptsToReview = result.keywords.filter(kw => kw.rating <= 3);

  return (
    <div className="text-center">
      {/* Score display */}
      <div className={`text-5xl mb-2 ${scoreInfo.color}`}>{scoreInfo.emoji}</div>
      <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        {scoreInfo.label}
      </h3>

      {/* Overall star rating */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-8 h-8 ${
                star <= averageRating
                  ? 'text-yellow-400'
                  : isDark ? 'text-white/20' : 'text-slate-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      <p className={`text-sm mb-6 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        {result.score} / {result.maxScore} stars earned
      </p>

      {/* Progress bar */}
      <div className={`h-2 rounded-full mb-8 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Keyword breakdown with star ratings */}
      <div className="space-y-3 mb-6 text-left">
        {result.keywords.map((kw, index) => {
          const isGood = kw.rating >= 4;
          const needsWork = kw.rating <= 3;

          return (
            <div
              key={kw.word}
              className={`p-4 rounded-xl ${
                isGood
                  ? isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                  : isDark ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className={`font-semibold ${
                  isGood
                    ? isDark ? 'text-emerald-300' : 'text-emerald-700'
                    : isDark ? 'text-orange-300' : 'text-orange-700'
                }`}>
                  {kw.word}
                </p>
                <StarRating rating={kw.rating} isDark={isDark} />
              </div>

              <p className={`text-sm ${
                isGood
                  ? isDark ? 'text-emerald-400/80' : 'text-emerald-600'
                  : isDark ? 'text-orange-400/80' : 'text-orange-600'
              }`}>
                {kw.feedback}
              </p>

              {/* Review suggestion for low ratings */}
              {needsWork && kw.suggestion && (
                <div className={`mt-3 pt-3 border-t ${
                  isDark ? 'border-orange-500/20' : 'border-orange-200'
                }`}>
                  <button
                    onClick={onClose}
                    className={`flex items-center gap-2 text-xs font-medium ${
                      isDark ? 'text-orange-300 hover:text-orange-200' : 'text-orange-600 hover:text-orange-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    📖 {kw.suggestion}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Concepts to review summary */}
      {conceptsToReview.length > 0 && (
        <div className={`p-4 rounded-xl mb-6 ${
          isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
        }`}>
          <p className={`text-sm font-medium mb-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
            💡 Focus on these concepts:
          </p>
          <p className={`text-xs ${isDark ? 'text-blue-400/80' : 'text-blue-600'}`}>
            {conceptsToReview.map(c => c.word).join(', ')}
          </p>
        </div>
      )}

      {/* Encouragement */}
      <p className={`text-sm mb-6 italic ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        "{result.encouragement}"
      </p>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onTryAgain}
          className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
            isDark
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
        <button
          onClick={onClose}
          className={`px-6 py-3 rounded-xl font-semibold text-white transition-all flex items-center gap-2 ${
            isDark
              ? 'bg-gradient-to-r from-accent-500 to-emerald-500 hover:from-accent-400 hover:to-emerald-400'
              : 'bg-gradient-to-r from-accent-500 to-emerald-500 hover:from-accent-600 hover:to-emerald-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Done
        </button>
      </div>
    </div>
  );
}
