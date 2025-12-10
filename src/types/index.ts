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

export interface Content {
  id: string;
  topic_id: string;
  level: 'basic' | 'advanced';
  content: string;
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
