import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Note, SectionType } from '../types';

// Section type icons (matching SectionCard)
const sectionIcons: Record<SectionType, string> = {
  concept: '💡',
  why: '🎯',
  framework: '🔧',
  example: '🏢',
  takeaways: '✅',
  challenge: '🏆',
  deepdive: '🔬',
  casestudy: '📊',
  mistakes: '⚠️',
  protips: '💎',
};

interface NotesModalProps {
  notes: Note[];
  onClose: () => void;
  onRemoveNote: (noteId: string) => void;
  onClearAll: () => void;
}

export function NotesModal({ notes, onClose, onRemoveNote, onClearAll }: NotesModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Group notes by topic
  const notesByTopic = notes.reduce((acc, note) => {
    if (!acc[note.topicTitle]) {
      acc[note.topicTitle] = [];
    }
    acc[note.topicTitle].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full h-full md:h-[90vh] md:max-w-4xl md:mx-4 bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-primary-600 to-indigo-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Your Notes</h2>
              <p className="text-sm text-primary-100">{notes.length} {notes.length === 1 ? 'section' : 'sections'} saved</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">No notes yet</h3>
              <p className="text-sm text-slate-500 text-center max-w-xs">
                Click the "Save" button on any section while reading to add it to your notes.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-8">
              {Object.entries(notesByTopic).map(([topicTitle, topicNotes]) => (
                <div key={topicTitle}>
                  {/* Topic Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-primary-500 to-indigo-500 rounded-full" />
                    <h3 className="text-lg font-semibold text-slate-800">{topicTitle}</h3>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {topicNotes[0].level}
                    </span>
                  </div>

                  {/* Notes for this topic */}
                  <div className="space-y-4 pl-4">
                    {topicNotes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-slate-50 rounded-xl p-4 border border-slate-200 group hover:border-slate-300 transition-colors"
                      >
                        {/* Note Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{sectionIcons[note.sectionType] || '📝'}</span>
                            <h4 className="font-medium text-slate-700">{note.sectionTitle}</h4>
                          </div>
                          <button
                            onClick={() => onRemoveNote(note.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                            title="Remove note"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Note Content */}
                        <div className="prose prose-sm prose-slate max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="text-slate-600 mb-2 leading-relaxed text-sm">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-sm">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-sm">{children}</ol>,
                              li: ({ children }) => <li className="text-slate-600">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold text-slate-700">{children}</strong>,
                            }}
                          >
                            {note.content}
                          </ReactMarkdown>
                        </div>

                        {/* Timestamp */}
                        <div className="mt-3 pt-2 border-t border-slate-200">
                          <span className="text-xs text-slate-400">
                            Saved {new Date(note.savedAt).toLocaleDateString()} at {new Date(note.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notes.length > 0 && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Clear all notes
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
