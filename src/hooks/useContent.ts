import { useState, useCallback } from 'react';
import { generateContentStream } from '../lib/xai';
import { getBasicPrompt, getAdvancedPrompt } from '../lib/prompts';
import { Content, Topic, ContentSection } from '../types';

export function useContent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingSections, setStreamingSections] = useState<ContentSection[]>([]);

  const fetchOrGenerateContent = useCallback(async (
    topic: Topic,
    level: 'basic' | 'advanced',
    onSectionReceived?: (sections: ContentSection[]) => void
  ): Promise<Content | null> => {
    const totalStart = performance.now();
    console.log('⏱️ [CONTENT] ========== STREAMING CONTENT GENERATION START ==========');
    console.log(`⏱️ [CONTENT] Topic: ${topic.title}, Level: ${level}`);

    setError(null);
    setIsGenerating(true);
    setStreamingSections([]);

    try {
      const prompt = level === 'basic'
        ? getBasicPrompt(topic.title, topic.subtitle, topic.challenge)
        : getAdvancedPrompt(topic.title, topic.subtitle, topic.challenge);

      const sections: ContentSection[] = [];

      // Use streaming to get sections one by one
      for await (const section of generateContentStream(prompt)) {
        sections.push(section);
        setStreamingSections([...sections]);

        // Notify parent component of new section
        if (onSectionReceived) {
          onSectionReceived([...sections]);
        }

        console.log(`⏱️ [CONTENT] Section ${sections.length} rendered: ${section.title}`);
      }

      // Build final content object
      const result: Content = {
        id: crypto.randomUUID(),
        topic_id: topic.id,
        level,
        content: JSON.stringify({ sections }),
        structured: { sections },
        generated_at: new Date().toISOString(),
      };

      console.log(`⏱️ [CONTENT] ========== TOTAL TIME: ${((performance.now() - totalStart) / 1000).toFixed(2)}s ==========`);
      return result;
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
    streamingSections,
  };
}
