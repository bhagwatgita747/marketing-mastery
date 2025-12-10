import { useState, useCallback } from 'react';
import { generateContent } from '../lib/xai';
import { getBasicPrompt, getAdvancedPrompt } from '../lib/prompts';
import { Content, Topic } from '../types';

export function useContent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrGenerateContent = useCallback(async (
    topic: Topic,
    level: 'basic' | 'advanced'
  ): Promise<Content | null> => {
    setError(null);
    setIsGenerating(true);

    try {
      // Generate content directly (no caching for now - faster response)
      const prompt = level === 'basic'
        ? getBasicPrompt(topic.title, topic.subtitle, topic.challenge)
        : getAdvancedPrompt(topic.title, topic.subtitle, topic.challenge);

      const generatedContent = await generateContent(prompt);

      return {
        id: crypto.randomUUID(),
        topic_id: topic.id,
        level,
        content: generatedContent,
        generated_at: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error in fetchOrGenerateContent:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate content');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    fetchOrGenerateContent,
    isGenerating,
    error,
  };
}
