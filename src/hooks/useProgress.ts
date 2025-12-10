import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UserProgress } from '../types';

const USER_ID = 'isha'; // Hardcoded user for now

export function useProgress() {
  const [progress, setProgress] = useState<Map<string, UserProgress>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all progress on mount
  useEffect(() => {
    async function fetchProgress() {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', USER_ID);

        if (error) {
          console.log('Progress table may not exist yet, using empty progress');
          setIsLoading(false);
          return;
        }

        const progressMap = new Map<string, UserProgress>();
        (data || []).forEach((p: UserProgress) => {
          progressMap.set(p.topic_id, p);
        });
        setProgress(progressMap);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgress();
  }, []);

  const markBasicComplete = useCallback(async (topicId: string) => {
    try {
      const existing = progress.get(topicId);
      const now = new Date().toISOString();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('user_progress')
          .update({
            basic_completed: true,
            basic_completed_at: now,
          })
          .eq('id', existing.id);

        if (error) throw error;

        setProgress(prev => {
          const newMap = new Map(prev);
          newMap.set(topicId, {
            ...existing,
            basic_completed: true,
            basic_completed_at: now,
          });
          return newMap;
        });
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('user_progress')
          .insert({
            user_id: USER_ID,
            topic_id: topicId,
            basic_completed: true,
            basic_completed_at: now,
            advanced_completed: false,
          })
          .select()
          .single();

        if (error) throw error;

        setProgress(prev => {
          const newMap = new Map(prev);
          newMap.set(topicId, data);
          return newMap;
        });
      }
    } catch (err) {
      console.error('Error marking basic complete:', err);
      throw err;
    }
  }, [progress]);

  const markAdvancedComplete = useCallback(async (topicId: string) => {
    try {
      const existing = progress.get(topicId);
      const now = new Date().toISOString();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('user_progress')
          .update({
            advanced_completed: true,
            advanced_completed_at: now,
          })
          .eq('id', existing.id);

        if (error) throw error;

        setProgress(prev => {
          const newMap = new Map(prev);
          newMap.set(topicId, {
            ...existing,
            advanced_completed: true,
            advanced_completed_at: now,
          });
          return newMap;
        });
      } else {
        // Create new record (shouldn't happen normally, but handle it)
        const { data, error } = await supabase
          .from('user_progress')
          .insert({
            user_id: USER_ID,
            topic_id: topicId,
            basic_completed: true,
            basic_completed_at: now,
            advanced_completed: true,
            advanced_completed_at: now,
          })
          .select()
          .single();

        if (error) throw error;

        setProgress(prev => {
          const newMap = new Map(prev);
          newMap.set(topicId, data);
          return newMap;
        });
      }
    } catch (err) {
      console.error('Error marking advanced complete:', err);
      throw err;
    }
  }, [progress]);

  const getTopicProgress = useCallback((topicId: string): UserProgress | undefined => {
    return progress.get(topicId);
  }, [progress]);

  const isBasicComplete = useCallback((topicId: string): boolean => {
    return progress.get(topicId)?.basic_completed ?? false;
  }, [progress]);

  const isAdvancedComplete = useCallback((topicId: string): boolean => {
    return progress.get(topicId)?.advanced_completed ?? false;
  }, [progress]);

  const isAdvancedUnlocked = useCallback((topicId: string): boolean => {
    return progress.get(topicId)?.basic_completed ?? false;
  }, [progress]);

  return {
    progress,
    isLoading,
    markBasicComplete,
    markAdvancedComplete,
    getTopicProgress,
    isBasicComplete,
    isAdvancedComplete,
    isAdvancedUnlocked,
  };
}
