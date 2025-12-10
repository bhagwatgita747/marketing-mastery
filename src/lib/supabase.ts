import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for Supabase
export interface DbModule {
  id: string;
  module_number: number;
  title: string;
  description: string;
  created_at: string;
}

export interface DbTopic {
  id: string;
  module_id: string;
  title: string;
  subtitle: string;
  order_index: number;
  challenge: string | null;
  created_at: string;
}

export interface DbContent {
  id: string;
  topic_id: string;
  level: 'basic' | 'advanced';
  content: string;
  generated_at: string;
}

export interface DbUserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  basic_completed: boolean;
  basic_completed_at: string | null;
  advanced_completed: boolean;
  advanced_completed_at: string | null;
}
