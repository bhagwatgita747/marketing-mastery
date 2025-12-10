import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
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

    try {
      // First, try to fetch existing content from Supabase
      const { data: existing, error: fetchError } = await supabase
        .from('content')
        .select('*')
        .eq('topic_id', topic.id)
        .eq('level', level)
        .single();

      if (!fetchError && existing) {
        return existing as Content;
      }

      // Content doesn't exist, generate it
      setIsGenerating(true);

      const prompt = level === 'basic'
        ? getBasicPrompt(topic.title, topic.subtitle, topic.challenge)
        : getAdvancedPrompt(topic.title, topic.subtitle, topic.challenge);

      const generatedContent = await generateContent(prompt);

      // Save to Supabase
      const { data: saved, error: saveError } = await supabase
        .from('content')
        .insert({
          topic_id: topic.id,
          level,
          content: generatedContent,
          generated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving content to Supabase:', saveError);
        // Return the generated content even if save fails
        return {
          id: crypto.randomUUID(),
          topic_id: topic.id,
          level,
          content: generatedContent,
          generated_at: new Date().toISOString(),
        };
      }

      return saved as Content;
    } catch (err) {
      console.error('Error in fetchOrGenerateContent:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch or generate content');
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
