/**
 * OpenRouter API client for Gemini Flash Lite
 * Used for keyword extraction and transcript analysis in the Memorize feature
 * API key must be set via VITE_OPENROUTER_API_KEY environment variable
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-lite-001';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * Send a chat completion request to OpenRouter (Gemini Flash Lite)
 */
async function generateWithGemini(prompt: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  const messages: OpenRouterMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Marketing Mastery',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0].message.content;
}

/**
 * Extract 3-5 key concepts from content for memorization practice
 */
export async function extractKeywords(contentText: string): Promise<string[]> {
  const prompt = `You are helping a marketing professional memorize key concepts.

Extract exactly 3-5 of the most important concepts/keywords from this marketing content that a learner should remember and be able to explain.

Choose keywords that:
- Represent core concepts (not trivial details)
- Are specific enough to test understanding
- Cover the main ideas of the content

Content:
${contentText}

Return ONLY a JSON object in this exact format, nothing else:
{"keywords": ["Concept 1", "Concept 2", "Concept 3"]}`;

  const response = await generateWithGemini(prompt);

  // Parse JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse keywords response');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.keywords || !Array.isArray(parsed.keywords)) {
    throw new Error('Invalid keywords response format');
  }

  return parsed.keywords.slice(0, 5); // Ensure max 5 keywords
}

/**
 * Analyze user's verbal explanation against the content and keywords
 */
export interface KeywordAnalysis {
  word: string;
  covered: boolean;
  feedback: string;
}

export interface TranscriptAnalysis {
  score: number;
  total: number;
  keywords: KeywordAnalysis[];
  encouragement: string;
}

export async function analyzeTranscript(
  originalContent: string,
  keywords: string[],
  transcript: string
): Promise<TranscriptAnalysis> {
  const prompt = `You are analyzing a verbal recall exercise where a marketing professional explained what they learned.

ORIGINAL CONTENT THEY LEARNED:
${originalContent}

KEYWORDS THEY WERE ASKED TO EXPLAIN:
${keywords.join(', ')}

USER'S VERBAL EXPLANATION (transcribed):
"${transcript}"

Analyze how well the user explained each keyword concept. Be encouraging but honest.

Consider:
- Did they mention the concept or related ideas?
- Did they show understanding of what it means?
- Did they explain it accurately?

Return ONLY a JSON object in this exact format:
{
  "score": <number of keywords covered>,
  "total": ${keywords.length},
  "keywords": [
    {"word": "Keyword1", "covered": true, "feedback": "Great explanation of..."},
    {"word": "Keyword2", "covered": false, "feedback": "Try mentioning..."}
  ],
  "encouragement": "Overall encouraging message about their recall"
}`;

  const response = await generateWithGemini(prompt);

  // Parse JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse analysis response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Validate response structure
  if (
    typeof parsed.score !== 'number' ||
    typeof parsed.total !== 'number' ||
    !Array.isArray(parsed.keywords) ||
    typeof parsed.encouragement !== 'string'
  ) {
    throw new Error('Invalid analysis response format');
  }

  return parsed as TranscriptAnalysis;
}
