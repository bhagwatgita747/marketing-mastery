import { ContentSection } from '../types';

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

interface XAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface XAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Non-streaming version (kept for backward compatibility)
export async function generateContent(prompt: string): Promise<string> {
  const totalStart = performance.now();
  console.log('⏱️ [XAI] Starting API call...');

  const messages: XAIMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await fetch(XAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-2-latest',
      messages,
      temperature: 0.7,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`xAI API error: ${error}`);
  }

  const data: XAIResponse = await response.json();
  const content = data.choices[0].message.content;
  console.log(`⏱️ [XAI] TOTAL API TIME: ${((performance.now() - totalStart) / 1000).toFixed(2)}s`);

  return content;
}

// Streaming version - yields complete sections as they arrive
export async function* generateContentStream(prompt: string): AsyncGenerator<ContentSection, void, unknown> {
  const totalStart = performance.now();
  console.log('⏱️ [XAI-STREAM] Starting streaming API call...');

  const messages: XAIMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await fetch(XAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-2-latest',
      messages,
      temperature: 0.7,
      max_tokens: 2500,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`xAI API error: ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';
  let sectionsYielded = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process SSE lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            fullContent += delta;

            // Try to extract complete sections from the accumulated content
            const sections = extractCompleteSections(fullContent);

            // Yield any new complete sections
            while (sectionsYielded < sections.length) {
              const section = sections[sectionsYielded];
              console.log(`⏱️ [XAI-STREAM] Section ${sectionsYielded + 1} complete: ${section.title} (${((performance.now() - totalStart) / 1000).toFixed(2)}s)`);
              yield section;
              sectionsYielded++;
            }
          } catch {
            // Ignore JSON parse errors for incomplete chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  console.log(`⏱️ [XAI-STREAM] TOTAL TIME: ${((performance.now() - totalStart) / 1000).toFixed(2)}s, Sections: ${sectionsYielded}`);
}

// Extract complete section objects from partial JSON
function extractCompleteSections(content: string): ContentSection[] {
  const sections: ContentSection[] = [];

  // Find the sections array start
  const sectionsMatch = content.match(/"sections"\s*:\s*\[/);
  if (!sectionsMatch) return sections;

  const startIndex = sectionsMatch.index! + sectionsMatch[0].length;
  let workingContent = content.slice(startIndex);

  // Extract each complete section object
  let braceDepth = 0;
  let inString = false;
  let escapeNext = false;
  let sectionStart = -1;

  for (let i = 0; i < workingContent.length; i++) {
    const char = workingContent[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') {
      if (braceDepth === 0) {
        sectionStart = i;
      }
      braceDepth++;
    } else if (char === '}') {
      braceDepth--;
      if (braceDepth === 0 && sectionStart !== -1) {
        // Found a complete section
        const sectionJson = workingContent.slice(sectionStart, i + 1);
        try {
          const section = JSON.parse(sectionJson);
          if (section.type && section.title && section.content) {
            sections.push(section as ContentSection);
          }
        } catch {
          // Incomplete or invalid JSON, skip
        }
        sectionStart = -1;
      }
    }
  }

  return sections;
}
