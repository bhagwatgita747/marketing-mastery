/**
 * MemorizeOnboarding - Animated introduction for first-time users
 * Shows a 5-step walkthrough of the Memorize feature
 */

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Confetti } from './Confetti';

interface MemorizeOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

const STEP_DURATIONS: Record<OnboardingStep, number> = {
  1: 2000,  // Read content
  2: 2000,  // Keywords appear
  3: 2500,  // Speak knowledge
  4: 2000,  // AI analyzes
  5: 3000,  // Results (includes button reveal)
};

export function MemorizeOnboarding({ onComplete, onSkip }: MemorizeOnboardingProps) {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [isExiting, setIsExiting] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Auto-advance steps
  useEffect(() => {
    if (currentStep === 5) {
      // Show confetti and button on final step
      const confettiTimer = setTimeout(() => setShowConfetti(true), 500);
      const buttonTimer = setTimeout(() => setShowButton(true), 1000);
      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(buttonTimer);
      };
    }

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) as OnboardingStep);
        setIsExiting(false);
      }, 300);
    }, STEP_DURATIONS[currentStep]);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    onSkip();
  }, [onSkip]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className={`absolute inset-0 backdrop-blur-md ${
        isDark ? 'bg-black/80' : 'bg-white/80'
      }`} />

      {/* Confetti on final step */}
      <Confetti trigger={showConfetti} onComplete={() => {}} />

      {/* Main container */}
      <div className={`relative w-full max-w-md mx-4 p-8 rounded-3xl shadow-2xl ${
        isDark
          ? 'bg-[#0f0f1a] border border-white/10'
          : 'bg-white border border-slate-200'
      }`}>
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className={`absolute top-4 right-4 text-sm font-medium transition-colors ${
            isDark
              ? 'text-white/50 hover:text-white/80'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Skip
        </button>

        {/* Step indicator dots */}
        <div className="flex justify-center gap-2 mb-8">
          {([1, 2, 3, 4, 5] as OnboardingStep[]).map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? `w-6 ${isDark ? 'bg-accent-400' : 'bg-accent-500'}`
                  : step < currentStep
                  ? `w-2 ${isDark ? 'bg-accent-400' : 'bg-accent-500'}`
                  : `w-2 ${isDark ? 'bg-white/20' : 'bg-slate-200'}`
              }`}
            />
          ))}
        </div>

        {/* Animation container */}
        <div className={`min-h-[280px] flex flex-col items-center justify-center transition-opacity duration-300 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}>
          {currentStep === 1 && <StepReadContent isDark={isDark} />}
          {currentStep === 2 && <StepKeywordsAppear isDark={isDark} />}
          {currentStep === 3 && <StepSpeakKnowledge isDark={isDark} />}
          {currentStep === 4 && <StepAIAnalyzes isDark={isDark} />}
          {currentStep === 5 && (
            <StepResults
              isDark={isDark}
              showButton={showButton}
              onTryNow={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Step Components ============

interface StepProps {
  isDark: boolean;
}

function StepReadContent({ isDark }: StepProps) {
  return (
    <div className="text-center">
      {/* Animated book icon */}
      <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center animate-pulse ${
        isDark ? 'bg-primary-500/20' : 'bg-primary-100'
      }`}>
        <svg className={`w-12 h-12 ${isDark ? 'text-primary-400' : 'text-primary-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>

      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        Read the Content
      </h3>
      <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        First, absorb the marketing concepts at your own pace
      </p>
    </div>
  );
}

function StepKeywordsAppear({ isDark }: StepProps) {
  const keywords = ['Brand Voice', 'Target Audience', 'Value Prop'];

  return (
    <div className="text-center">
      {/* Keywords with staggered animation */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {keywords.map((keyword, index) => (
          <div
            key={keyword}
            className={`px-4 py-2 rounded-full text-sm font-medium animate-bounce-in ${
              isDark
                ? 'bg-gradient-to-r from-primary-500/30 to-accent-500/30 text-white border border-white/10'
                : 'bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 border border-primary-200'
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {keyword}
          </div>
        ))}
      </div>

      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        Key Concepts Pop Up
      </h3>
      <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        3-5 keywords guide your recall practice
      </p>
    </div>
  );
}

function StepSpeakKnowledge({ isDark }: StepProps) {
  return (
    <div className="text-center">
      {/* Microphone with pulse rings */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        {/* Pulse rings */}
        <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
          isDark ? 'bg-accent-400' : 'bg-accent-500'
        }`} />
        <div className={`absolute inset-2 rounded-full animate-pulse opacity-50 ${
          isDark ? 'bg-accent-400' : 'bg-accent-500'
        }`} />

        {/* Mic icon */}
        <div className={`relative w-full h-full rounded-2xl flex items-center justify-center ${
          isDark ? 'bg-accent-500/20' : 'bg-accent-100'
        }`}>
          <svg className={`w-10 h-10 ${isDark ? 'text-accent-400' : 'text-accent-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>

      {/* Sound wave bars */}
      <div className="flex justify-center gap-1 mb-6">
        {[0.2, 0.5, 0.8, 0.4, 0.6].map((delay, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full ${isDark ? 'bg-accent-400' : 'bg-accent-500'}`}
            style={{
              height: '32px',
              animation: 'soundWave 0.6s ease-in-out infinite',
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        Speak What You Learned
      </h3>
      <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        Explain the concepts in your own words
      </p>
    </div>
  );
}

function StepAIAnalyzes({ isDark }: StepProps) {
  return (
    <div className="text-center">
      {/* Brain with rotating effect */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        {/* Rotating gradient border */}
        <div
          className={`absolute inset-0 rounded-full ${isDark ? 'bg-primary-400' : 'bg-primary-500'}`}
          style={{
            background: isDark
              ? 'conic-gradient(from 0deg, #818cf8, #34d399, #818cf8)'
              : 'conic-gradient(from 0deg, #6366f1, #10b981, #6366f1)',
            animation: 'spin 3s linear infinite',
            padding: '2px',
          }}
        >
          <div className={`w-full h-full rounded-full ${isDark ? 'bg-[#0f0f1a]' : 'bg-white'}`} />
        </div>

        {/* Brain icon */}
        <div className={`absolute inset-3 rounded-xl flex items-center justify-center ${
          isDark ? 'bg-primary-500/20' : 'bg-primary-100'
        }`}>
          <svg className={`w-8 h-8 ${isDark ? 'text-primary-400' : 'text-primary-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        {/* Sparkles */}
        <div className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 text-yellow-400 animate-pulse" style={{ animationDelay: '0.3s' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
          </svg>
        </div>
      </div>

      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        AI Analyzes Your Response
      </h3>
      <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        Smart analysis of your understanding
      </p>
    </div>
  );
}

interface StepResultsProps extends StepProps {
  showButton: boolean;
  onTryNow: () => void;
}

function StepResults({ isDark, showButton, onTryNow }: StepResultsProps) {
  return (
    <div className="text-center">
      {/* Success checkmark with glow */}
      <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
        isDark
          ? 'bg-gradient-to-br from-accent-400/30 to-emerald-400/30'
          : 'bg-gradient-to-br from-accent-100 to-emerald-100'
      }`}>
        <svg
          className={`w-12 h-12 ${isDark ? 'text-accent-400' : 'text-accent-500'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        Get Personalized Feedback
      </h3>
      <p className={`text-sm mb-6 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        See what you remembered and what to review
      </p>

      {/* Try Now button with scale-in animation */}
      {showButton && (
        <button
          onClick={onTryNow}
          className={`px-8 py-3 rounded-xl font-semibold text-white transition-all transform animate-bounce-in hover:scale-105 ${
            isDark
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 shadow-lg shadow-primary-500/25'
              : 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg'
          }`}
        >
          Try It Now
        </button>
      )}
    </div>
  );
}
