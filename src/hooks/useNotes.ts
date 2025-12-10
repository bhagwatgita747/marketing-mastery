import { useState, useCallback, useEffect } from 'react';
import { Note, SectionType } from '../types';

const NOTES_STORAGE_KEY = 'marketing_mastery_notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse notes from localStorage:', e);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback((
    topicId: string,
    topicTitle: string,
    level: 'basic' | 'advanced',
    sectionType: SectionType,
    sectionTitle: string,
    content: string
  ) => {
    const newNote: Note = {
      id: `${topicId}-${level}-${sectionType}-${Date.now()}`,
      topicId,
      topicTitle,
      level,
      sectionType,
      sectionTitle,
      content,
      savedAt: new Date().toISOString(),
    };
    setNotes(prev => [...prev, newNote]);
    return newNote;
  }, []);

  const removeNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  }, []);

  const isNoteSaved = useCallback((
    topicId: string,
    level: 'basic' | 'advanced',
    sectionType: SectionType
  ) => {
    return notes.some(
      note => note.topicId === topicId && note.level === level && note.sectionType === sectionType
    );
  }, [notes]);

  const getNoteBySection = useCallback((
    topicId: string,
    level: 'basic' | 'advanced',
    sectionType: SectionType
  ) => {
    return notes.find(
      note => note.topicId === topicId && note.level === level && note.sectionType === sectionType
    );
  }, [notes]);

  const toggleNote = useCallback((
    topicId: string,
    topicTitle: string,
    level: 'basic' | 'advanced',
    sectionType: SectionType,
    sectionTitle: string,
    content: string
  ) => {
    const existing = getNoteBySection(topicId, level, sectionType);
    if (existing) {
      removeNote(existing.id);
      return false; // Removed
    } else {
      addNote(topicId, topicTitle, level, sectionType, sectionTitle, content);
      return true; // Added
    }
  }, [addNote, removeNote, getNoteBySection]);

  const clearAllNotes = useCallback(() => {
    setNotes([]);
  }, []);

  const getNotesByTopic = useCallback((topicId: string) => {
    return notes.filter(note => note.topicId === topicId);
  }, [notes]);

  return {
    notes,
    addNote,
    removeNote,
    isNoteSaved,
    getNoteBySection,
    toggleNote,
    clearAllNotes,
    getNotesByTopic,
    totalNotes: notes.length,
  };
}
