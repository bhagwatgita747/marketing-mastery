import { useState, useCallback } from 'react';
import { generateContent } from '../lib/xai';
import { getQuizPrompt } from '../lib/prompts';
import { Topic, Quiz } from '../types';

// Parse JSON response from Grok for quiz
function parseQuizResponse(rawContent: string): Quiz | null {
  try {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return parsed as Quiz;
    }
    return null;
  } catch {
    console.warn('Failed to parse quiz response');
    return null;
  }
}

export function useQuiz() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = useCallback(async (
    topic: Topic,
    level: 'basic' | 'advanced'
  ): Promise<Quiz | null> => {
    setError(null);
    setIsGenerating(true);

    try {
      const prompt = getQuizPrompt(topic.title, topic.subtitle, level);
      const response = await generateContent(prompt);
      const quiz = parseQuizResponse(response);

      if (!quiz) {
        throw new Error('Failed to generate quiz questions');
      }

      return quiz;
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateQuiz,
    isGenerating,
    error,
  };
}
