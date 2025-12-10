export function getBasicPrompt(topicTitle: string, topicSubtitle: string, challenge?: string): string {
  return `You are a marketing educator creating content for Isha, a 34-year-old marketing professional working at Nivea India (FMCG/beauty industry) based in Bangalore.

Topic: ${topicTitle}
Context: ${topicSubtitle}

Return a JSON object with the following structure. Each section's content should be in markdown format:

{
  "sections": [
    {
      "type": "concept",
      "title": "The Concept",
      "content": "Clear, jargon-free definition of the concept in 2-3 paragraphs"
    },
    {
      "type": "why",
      "title": "Why It Matters",
      "content": "Real impact on business outcomes with FMCG/beauty examples"
    },
    {
      "type": "framework",
      "title": "The Framework",
      "content": "The core 20% knowledge that delivers 80% of results - include specific steps or a framework"
    },
    {
      "type": "example",
      "title": "Nivea Example",
      "content": "One specific example Isha could apply at Nivea"
    },
    {
      "type": "takeaways",
      "title": "Key Takeaways",
      "content": "3-5 actionable bullet points in markdown list format"
    }${challenge ? `,
    {
      "type": "challenge",
      "title": "Mini-Challenge",
      "content": "${challenge}"
    }` : ''}
  ]
}

Guidelines:
- Return ONLY valid JSON, no text before or after
- Each content field should use markdown (bold, bullets, etc.)
- Keep total reading time ~5 minutes
- Be practical and actionable, not theoretical
- Use Nivea/FMCG examples where relevant`;
}

export function getAdvancedPrompt(topicTitle: string, topicSubtitle: string, challenge?: string): string {
  return `You are a marketing educator creating ADVANCED content for Isha, a 34-year-old marketing professional at Nivea India who has already completed the basic level for this topic.

Topic: ${topicTitle}
Context: ${topicSubtitle}

Return a JSON object with the following structure. Each section's content should be in markdown format:

{
  "sections": [
    {
      "type": "deepdive",
      "title": "Deep Dive",
      "content": "Nuances, edge cases, and advanced considerations"
    },
    {
      "type": "framework",
      "title": "Advanced Framework",
      "content": "Mental models and frameworks used by top marketers - include specific steps"
    },
    {
      "type": "casestudy",
      "title": "Case Study",
      "content": "Real-world example from FMCG/beauty industry (Nivea, L'Oreal, Dove, etc.)"
    },
    {
      "type": "mistakes",
      "title": "Common Mistakes",
      "content": "What experienced marketers get wrong and how to avoid it"
    },
    {
      "type": "protips",
      "title": "Pro Tips",
      "content": "Insider knowledge and advanced tactics"
    },
    {
      "type": "takeaways",
      "title": "Key Takeaways",
      "content": "3-5 expert-level insights in markdown list format"
    }${challenge ? `,
    {
      "type": "challenge",
      "title": "Mini-Challenge",
      "content": "${challenge}"
    }` : ''}
  ]
}

Guidelines:
- Return ONLY valid JSON, no text before or after
- Assume foundational knowledge (advanced level)
- Include specific metrics, benchmarks, industry standards
- Reference real tools, platforms, techniques
- Each content field should use markdown
- Reading time ~8-10 minutes
- Focus on mastery-level insights`;
}

export function getQuizPrompt(topicTitle: string, topicSubtitle: string, level: 'basic' | 'advanced'): string {
  return `You are a marketing educator creating a quiz for Isha, a 34-year-old marketing professional at Nivea India.

Topic: ${topicTitle}
Context: ${topicSubtitle}
Level: ${level === 'basic' ? 'Basic (foundational concepts)' : 'Advanced (deeper understanding)'}

Create exactly 5 multiple-choice questions to test understanding of this topic.

Return a JSON object with the following structure:

{
  "questions": [
    {
      "question": "The question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Guidelines:
- Return ONLY valid JSON, no text before or after
- Each question should have exactly 4 options
- correctIndex is 0-based (0 for first option, 3 for last)
- Questions should test practical understanding, not just definitions
- Include FMCG/beauty industry context where relevant
- Mix difficulty: 2 easy, 2 medium, 1 challenging
- Explanations should be 1-2 sentences`;
}
