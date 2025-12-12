import { useState, useCallback } from 'react';
import { generateContent } from '../lib/xai';
import { getBasicPrompt, getAdvancedPrompt } from '../lib/prompts';
import { Content, Topic, StructuredContent } from '../types';

// Parse JSON response from Grok, with fallback handling
function parseStructuredContent(rawContent: string): StructuredContent | null {
  const parseStart = performance.now();
  try {
    // Try to extract JSON from the response (in case there's extra text)
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.sections && Array.isArray(parsed.sections)) {
      console.log(`⏱️ [CONTENT] JSON parsing took ${((performance.now() - parseStart) / 1000).toFixed(3)}s`);
      return parsed as StructuredContent;
    }
    return null;
  } catch {
    console.warn('Failed to parse structured content, falling back to raw markdown');
    return null;
  }
}

export function useContent() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrGenerateContent = useCallback(async (
    topic: Topic,
    level: 'basic' | 'advanced'
  ): Promise<Content | null> => {
    const totalStart = performance.now();
    console.log('⏱️ [CONTENT] ========== CONTENT GENERATION START ==========');
    console.log(`⏱️ [CONTENT] Topic: ${topic.title}, Level: ${level}`);

    setError(null);
    setIsGenerating(true);

    try {
      // Generate content directly (no caching for now - faster response)
      const promptStart = performance.now();
      const prompt = level === 'basic'
        ? getBasicPrompt(topic.title, topic.subtitle, topic.challenge)
        : getAdvancedPrompt(topic.title, topic.subtitle, topic.challenge);
      console.log(`⏱️ [CONTENT] Prompt generation: ${((performance.now() - promptStart) / 1000).toFixed(3)}s`);

      const apiStart = performance.now();
      const generatedContent = await generateContent(prompt);
      console.log(`⏱️ [CONTENT] API call total: ${((performance.now() - apiStart) / 1000).toFixed(2)}s`);

      // Try to parse as structured JSON
      const structured = parseStructuredContent(generatedContent);

      const result = {
        id: crypto.randomUUID(),
        topic_id: topic.id,
        level,
        content: generatedContent,
        structured: structured || undefined,
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
  };
}
