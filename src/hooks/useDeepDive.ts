import { useState, useCallback } from 'react';
import { generateContent } from '../lib/xai';
import { getDeepDivePrompt, DeepDiveMode } from '../lib/prompts';
import { DeepDiveResponse } from '../types';

export function useDeepDive() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDeepDive = useCallback(async (
    topicTitle: string,
    sectionTitle: string,
    sectionContent: string,
    mode: DeepDiveMode
  ): Promise<DeepDiveResponse | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const prompt = getDeepDivePrompt(topicTitle, sectionTitle, sectionContent, mode);
      const response = await generateContent(prompt);

      // Parse JSON response
      try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as DeepDiveResponse;
          return parsed;
        }
        throw new Error('No JSON found in response');
      } catch (parseError) {
        // Fallback: create a simple response from raw text
        console.warn('Failed to parse Deep Dive JSON, using fallback:', parseError);
        return {
          title: `${mode === 'simpler' ? 'Simplified' : mode === 'examples' ? 'More Examples' : mode === 'apply' ? 'Applied to Nivea' : 'Deep Dive'}`,
          content: response,
          followUp: 'What aspect would you like to explore further?',
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate deep dive';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateDeepDive,
    isGenerating,
    error,
  };
}
