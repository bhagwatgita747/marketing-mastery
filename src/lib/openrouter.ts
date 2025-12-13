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
 * Returns star ratings (1-5) for each concept
 */
export interface KeywordAnalysis {
  word: string;
  rating: number; // 1-5 stars
  feedback: string;
  suggestion?: string; // What to review if rating < 4
}

export interface TranscriptAnalysis {
  score: number; // Total stars earned
  maxScore: number; // Maximum possible stars
  keywords: KeywordAnalysis[];
  encouragement: string;
  overallRating: number; // 1-5 overall
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

Rate how well the user explained EACH keyword concept on a scale of 1-5 stars:
⭐ (1): Not mentioned at all
⭐⭐ (2): Briefly mentioned but not explained
⭐⭐⭐ (3): Partial understanding shown
⭐⭐⭐⭐ (4): Good explanation with minor gaps
⭐⭐⭐⭐⭐ (5): Excellent, complete understanding demonstrated

Be encouraging but honest. For concepts rated 3 or below, provide a specific suggestion of what to review.

Return ONLY a JSON object in this exact format:
{
  "score": <total stars earned across all keywords>,
  "maxScore": ${keywords.length * 5},
  "overallRating": <1-5 overall performance>,
  "keywords": [
    {"word": "Keyword1", "rating": 5, "feedback": "Excellent explanation of..."},
    {"word": "Keyword2", "rating": 2, "feedback": "You mentioned it briefly...", "suggestion": "Review the section about X to understand Y better"}
  ],
  "encouragement": "Encouraging message based on overall performance"
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
    typeof parsed.maxScore !== 'number' ||
    typeof parsed.overallRating !== 'number' ||
    !Array.isArray(parsed.keywords) ||
    typeof parsed.encouragement !== 'string'
  ) {
    throw new Error('Invalid analysis response format');
  }

  return parsed as TranscriptAnalysis;
}
