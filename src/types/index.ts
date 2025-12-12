export interface Module {
  id: string;
  module_number: number;
  title: string;
  description: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  module_id: string;
  title: string;
  subtitle: string;
  order_index: number;
  challenge?: string;
}

export type SectionType =
  | 'concept'
  | 'why'
  | 'framework'
  | 'example'
  | 'takeaways'
  | 'challenge'
  | 'deepdive'
  | 'casestudy'
  | 'mistakes'
  | 'protips';

export interface ContentSection {
  type: SectionType;
  title: string;
  content: string;
}

export interface StructuredContent {
  sections: ContentSection[];
}

export interface Content {
  id: string;
  topic_id: string;
  level: 'basic' | 'advanced';
  content: string; // Raw content (fallback)
  structured?: StructuredContent; // Parsed JSON sections
  generated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  basic_completed: boolean;
  basic_completed_at: string | null;
  advanced_completed: boolean;
  advanced_completed_at: string | null;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}

export interface ModuleWithProgress extends Module {
  completedBasic: number;
  completedAdvanced: number;
  totalTopics: number;
}

// Quiz types
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizResult {
  topicId: string;
  level: 'basic' | 'advanced';
  score: number;
  totalQuestions: number;
  completedAt: string;
}

// Notes types
export interface Note {
  id: string;
  topicId: string;
  topicTitle: string;
  level: 'basic' | 'advanced';
  sectionType: SectionType;
  sectionTitle: string;
  content: string;
  savedAt: string;
}

// Deep Dive types
export type DeepDiveMode = 'explain' | 'simpler' | 'examples' | 'apply';

export interface DeepDiveResponse {
  title: string;
  content: string;
  followUp: string;
}

// Marketing Tier system
export type MarketingTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface TierInfo {
  tier: MarketingTier;
  label: string;
  emoji: string;
  minTopics: number;
  maxTopics: number;
  color: string;
  bgColor: string;
}

// Memorize feature types
export interface KeywordResult {
  word: string;
  covered: boolean;
  feedback: string;
}

export interface MemorizeResult {
  score: number;
  total: number;
  keywords: KeywordResult[];
  encouragement: string;
}
