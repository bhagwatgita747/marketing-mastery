/**
 * Hook for the "Memorize This Easily" feature
 * Handles keyword extraction and transcript analysis
 */

import { useState, useCallback } from 'react';
import { extractKeywords, analyzeTranscript, TranscriptAnalysis } from '../lib/openrouter';
import { StructuredContent, MemorizeResult } from '../types';

interface UseMemorizeReturn {
  // Keyword extraction
  keywords: string[];
  isExtractingKeywords: boolean;
  extractKeywordsFromContent: (content: StructuredContent) => Promise<string[]>;

  // Transcript analysis
  result: MemorizeResult | null;
  isAnalyzing: boolean;
  analyzeUserTranscript: (
    content: StructuredContent,
    keywords: string[],
    transcript: string
  ) => Promise<MemorizeResult | null>;

  // Error handling
  error: string | null;
  clearError: () => void;

  // Reset state
  reset: () => void;
}

export function useMemorize(): UseMemorizeReturn {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isExtractingKeywords, setIsExtractingKeywords] = useState(false);
  const [result, setResult] = useState<MemorizeResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Convert structured content to plain text for API calls
   */
  const contentToText = useCallback((content: StructuredContent): string => {
    return content.sections
      .map(section => `${section.title}:\n${section.content}`)
      .join('\n\n');
  }, []);

  /**
   * Extract keywords from content using Gemini
   */
  const extractKeywordsFromContent = useCallback(async (content: StructuredContent): Promise<string[]> => {
    setIsExtractingKeywords(true);
    setError(null);

    try {
      const contentText = contentToText(content);
      const extractedKeywords = await extractKeywords(contentText);
      setKeywords(extractedKeywords);
      return extractedKeywords;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract keywords';
      setError(errorMessage);
      console.error('Keyword extraction error:', err);
      return [];
    } finally {
      setIsExtractingKeywords(false);
    }
  }, [contentToText]);

  /**
   * Analyze user's transcript against content and keywords
   */
  const analyzeUserTranscript = useCallback(async (
    content: StructuredContent,
    keywordsToAnalyze: string[],
    transcript: string
  ): Promise<MemorizeResult | null> => {
    if (!transcript.trim()) {
      setError('No speech detected. Please try speaking again.');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const contentText = contentToText(content);
      const analysis: TranscriptAnalysis = await analyzeTranscript(
        contentText,
        keywordsToAnalyze,
        transcript
      );

      const memorizeResult: MemorizeResult = {
        score: analysis.score,
        maxScore: analysis.maxScore,
        keywords: analysis.keywords,
        encouragement: analysis.encouragement,
        overallRating: analysis.overallRating,
      };

      setResult(memorizeResult);
      return memorizeResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze your response';
      setError(errorMessage);
      console.error('Transcript analysis error:', err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [contentToText]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset all state for a new attempt
   */
  const reset = useCallback(() => {
    setKeywords([]);
    setResult(null);
    setError(null);
  }, []);

  return {
    keywords,
    isExtractingKeywords,
    extractKeywordsFromContent,
    result,
    isAnalyzing,
    analyzeUserTranscript,
    error,
    clearError,
    reset,
  };
}

/**
 * Hook to track if user has seen the onboarding
 */
const ONBOARDING_STORAGE_KEY = 'marketing_mastery_memorize_onboarding';

export function useMemorizeOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'completed';
  });

  const markOnboardingComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'completed');
    setHasSeenOnboarding(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setHasSeenOnboarding(false);
  }, []);

  return {
    hasSeenOnboarding,
    markOnboardingComplete,
    resetOnboarding,
  };
}
