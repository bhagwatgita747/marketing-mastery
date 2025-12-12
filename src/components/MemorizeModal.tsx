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
              {/* Recording indicator */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className={`absolute inset-0 rounded-full animate-ping ${
                  isDark ? 'bg-red-400/30' : 'bg-red-500/30'
                }`} />
                <div className={`absolute inset-2 rounded-full animate-pulse ${
                  isDark ? 'bg-red-400/50' : 'bg-red-500/50'
                }`} />
                <div className={`relative w-full h-full rounded-full flex items-center justify-center ${
                  isDark ? 'bg-red-500' : 'bg-red-500'
                }`}>
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Timer */}
              <div className={`text-3xl font-mono font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {formatTime(elapsedTime)}
              </div>
              <p className={`text-sm mb-6 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                Recording... Speak about the concepts above
              </p>

              {/* Live transcript preview */}
              {(transcript || interimTranscript) && (
                <div className={`max-h-32 overflow-y-auto p-4 rounded-xl text-left text-sm mb-6 ${
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

// Results view component
interface ResultsViewProps {
  result: MemorizeResult;
  isDark: boolean;
  onTryAgain: () => void;
  onClose: () => void;
}

function ResultsView({ result, isDark, onTryAgain, onClose }: ResultsViewProps) {
  const percentage = Math.round((result.score / result.total) * 100);

  // Get emoji and color based on score
  const getScoreInfo = () => {
    if (percentage === 100) return { emoji: '🏆', color: 'text-yellow-500', label: 'Perfect!' };
    if (percentage >= 80) return { emoji: '🎉', color: 'text-green-500', label: 'Excellent!' };
    if (percentage >= 60) return { emoji: '👍', color: 'text-blue-500', label: 'Good job!' };
    return { emoji: '📚', color: 'text-orange-500', label: 'Keep practicing!' };
  };

  const scoreInfo = getScoreInfo();

  return (
    <div className="text-center">
      {/* Score display */}
      <div className={`text-6xl mb-2 ${scoreInfo.color}`}>{scoreInfo.emoji}</div>
      <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        {scoreInfo.label}
      </h3>
      <p className={`text-lg mb-6 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        You covered <span className="font-semibold">{result.score}</span> of <span className="font-semibold">{result.total}</span> concepts
      </p>

      {/* Progress bar */}
      <div className={`h-3 rounded-full mb-8 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Keyword breakdown */}
      <div className="space-y-3 mb-8 text-left">
        {result.keywords.map((kw, index) => (
          <div
            key={kw.word}
            className={`p-4 rounded-xl ${
              kw.covered
                ? isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                : isDark ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                kw.covered
                  ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                  : isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
              }`}>
                {kw.covered ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  kw.covered
                    ? isDark ? 'text-emerald-300' : 'text-emerald-700'
                    : isDark ? 'text-orange-300' : 'text-orange-700'
                }`}>
                  {kw.word}
                </p>
                <p className={`text-sm mt-1 ${
                  kw.covered
                    ? isDark ? 'text-emerald-400/80' : 'text-emerald-600'
                    : isDark ? 'text-orange-400/80' : 'text-orange-600'
                }`}>
                  {kw.feedback}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Encouragement */}
      <p className={`text-sm mb-8 italic ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        "{result.encouragement}"
      </p>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onTryAgain}
          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
            isDark
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Try Again
        </button>
        <button
          onClick={onClose}
          className={`px-6 py-3 rounded-xl font-semibold text-white transition-all ${
            isDark
              ? 'bg-gradient-to-r from-accent-500 to-emerald-500 hover:from-accent-400 hover:to-emerald-400'
              : 'bg-gradient-to-r from-accent-500 to-emerald-500 hover:from-accent-600 hover:to-emerald-600'
          }`}
        >
          Done
        </button>
      </div>
    </div>
  );
}
