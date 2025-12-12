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

export async function generateContent(prompt: string): Promise<string> {
  const totalStart = performance.now();
  console.log('⏱️ [XAI] Starting API call...');
  console.log('⏱️ [XAI] Prompt length:', prompt.length, 'chars');

  const messages: XAIMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const fetchStart = performance.now();
  const response = await fetch(XAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-2-latest',  // Fastest model (~4-5s vs 10-30s for grok-4-fast)
      messages,
      temperature: 0.7,
      max_tokens: 2500,  // Reduced for faster response
    }),
  });
  const fetchEnd = performance.now();
  console.log(`⏱️ [XAI] Fetch completed in ${((fetchEnd - fetchStart) / 1000).toFixed(2)}s`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`xAI API error: ${error}`);
  }

  const parseStart = performance.now();
  const data: XAIResponse = await response.json();
  const parseEnd = performance.now();
  console.log(`⏱️ [XAI] JSON parse in ${((parseEnd - parseStart) / 1000).toFixed(3)}s`);

  const content = data.choices[0].message.content;
  console.log(`⏱️ [XAI] Response length: ${content.length} chars`);
  console.log(`⏱️ [XAI] TOTAL API TIME: ${((performance.now() - totalStart) / 1000).toFixed(2)}s`);

  return content;
}
