import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Module, Topic } from '../types';
import { modules as localModules } from '../data/curriculum';

export function useModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModules() {
      try {
        // First try to fetch from Supabase
        const { data: dbModules, error: modulesError } = await supabase
          .from('modules')
          .select('*')
          .order('module_number');

        if (modulesError) {
          // If Supabase tables don't exist yet, use local data
          console.log('Using local curriculum data (Supabase tables may not be set up yet)');
          setModules(localModules);
          setIsLoading(false);
          return;
        }

        if (!dbModules || dbModules.length === 0) {
          // No data in Supabase, use local
          setModules(localModules);
          setIsLoading(false);
          return;
        }

        // Fetch topics for each module
        const { data: dbTopics, error: topicsError } = await supabase
          .from('topics')
          .select('*')
          .order('order_index');

        if (topicsError) {
          throw topicsError;
        }

        // Combine modules with their topics
        const modulesWithTopics: Module[] = dbModules.map(mod => ({
          id: mod.id,
          module_number: mod.module_number,
          title: mod.title,
          description: mod.description,
          topics: (dbTopics || [])
            .filter((t: Topic) => t.module_id === mod.id)
            .sort((a: Topic, b: Topic) => a.order_index - b.order_index),
        }));

        setModules(modulesWithTopics);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch modules');
        // Fallback to local data
        setModules(localModules);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModules();
  }, []);

  return { modules, isLoading, error };
}
