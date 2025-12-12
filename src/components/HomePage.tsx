import { useState, useCallback, useEffect, useMemo } from 'react';
import { useModules } from '../hooks/useModules';
import { useProgress } from '../hooks/useProgress';
import { useContent } from '../hooks/useContent';
import { useQuiz } from '../hooks/useQuiz';
import { useNotes } from '../hooks/useNotes';
import { useTheme } from '../hooks/useTheme';
import { ModuleAccordion } from './ModuleAccordion';
import { ContentModal } from './ContentModal';
import { QuizModal } from './QuizModal';
import { NotesModal } from './NotesModal';
import { MemorizeModal } from './MemorizeModal';
import { LoadingSpinner } from './LoadingSpinner';
import { Confetti } from './Confetti';
import { Topic, Content, Quiz, SectionType } from '../types';
import { calculateScore } from '../lib/tiers';

interface HomePageProps {
  username: string;
  onLogout: () => void;
}

export function HomePage({ username, onLogout }: HomePageProps) {
  const { modules, isLoading: modulesLoading } = useModules();
  const { toggleTheme, isDark } = useTheme();
  const {
    progress,
    isBasicComplete,
    isAdvancedComplete,
    isAdvancedUnlocked,
    markBasicComplete,
    markAdvancedComplete,
  } = useProgress();

  // Calculate progress score for tier system
  const progressScore = useMemo(() => calculateScore(progress), [progress]);
  const { fetchOrGenerateContent, isGenerating, error: contentError, streamingSections } = useContent();
  const { generateQuiz, isGenerating: isQuizGenerating, error: quizError } = useQuiz();
  const { notes, isNoteSaved, toggleNote, removeNote, clearAllNotes, totalNotes } = useNotes();

  // Modal state
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'basic' | 'advanced'>('basic');
  const [modalContent, setModalContent] = useState<Content | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // Confetti celebration state
  const [showConfetti, setShowConfetti] = useState(false);
  const [previousCompleted, setPreviousCompleted] = useState(0);

  // Notes modal state
  const [showNotesModal, setShowNotesModal] = useState(false);

  // Memorize modal state
  const [showMemorize, setShowMemorize] = useState(false);

  // Calculate overall progress
  const totalTopics = modules.reduce((sum, m) => sum + m.topics.length, 0);
  const completedBasic = modules.reduce(
    (sum, m) => sum + m.topics.filter(t => isBasicComplete(t.id)).length,
    0
  );
  const completedAdvanced = modules.reduce(
    (sum, m) => sum + m.topics.filter(t => isAdvancedComplete(t.id)).length,
    0
  );
  const totalCompleted = completedBasic + completedAdvanced;
  const totalPossible = totalTopics * 2;
  const progressPercent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  // Trigger confetti when progress increases
  useEffect(() => {
    if (totalCompleted > previousCompleted && previousCompleted > 0) {
      setShowConfetti(true);
    }
    setPreviousCompleted(totalCompleted);
  }, [totalCompleted, previousCompleted]);

  const handleTopicClick = useCallback(async (topic: Topic, level: 'basic' | 'advanced') => {
    const clickStart = performance.now();
    console.log('⏱️ [UI] ========== TOPIC CLICK START ==========');
    console.log(`⏱️ [UI] Topic: ${topic.title}`);

    setSelectedTopic(topic);
    setSelectedLevel(level);
    setModalContent(null);
    setIsModalLoading(true);
    console.log(`⏱️ [UI] State set, starting fetch at: ${((performance.now() - clickStart) / 1000).toFixed(3)}s`);

    const content = await fetchOrGenerateContent(topic, level);
    console.log(`⏱️ [UI] Content received at: ${((performance.now() - clickStart) / 1000).toFixed(2)}s`);

    setModalContent(content);
    setIsModalLoading(false);
    console.log(`⏱️ [UI] ========== TOTAL UI TIME: ${((performance.now() - clickStart) / 1000).toFixed(2)}s ==========`);
  }, [fetchOrGenerateContent]);

  const handleCloseModal = useCallback(() => {
    setSelectedTopic(null);
    setModalContent(null);
  }, []);

  const handleMarkComplete = useCallback(async () => {
    if (!selectedTopic) return;

    if (selectedLevel === 'basic') {
      await markBasicComplete(selectedTopic.id);
    } else {
      await markAdvancedComplete(selectedTopic.id);
    }
  }, [selectedTopic, selectedLevel, markBasicComplete, markAdvancedComplete]);

  const handleTakeQuiz = useCallback(async () => {
    if (!selectedTopic) return;

    setShowQuiz(true);
    setQuizData(null);
    setIsQuizLoading(true);

    const quiz = await generateQuiz(selectedTopic, selectedLevel);
    setQuizData(quiz);
    setIsQuizLoading(false);
  }, [selectedTopic, selectedLevel, generateQuiz]);

  const handleCloseQuiz = useCallback(() => {
    setShowQuiz(false);
    setQuizData(null);
  }, []);

  // Notes handlers
  const handleIsNoteSaved = useCallback((sectionType: SectionType) => {
    if (!selectedTopic) return false;
    return isNoteSaved(selectedTopic.id, selectedLevel, sectionType);
  }, [selectedTopic, selectedLevel, isNoteSaved]);

  const handleToggleNote = useCallback((sectionType: SectionType, sectionTitle: string, content: string) => {
    if (!selectedTopic) return;
    toggleNote(selectedTopic.id, selectedTopic.title, selectedLevel, sectionType, sectionTitle, content);
  }, [selectedTopic, selectedLevel, toggleNote]);

  const handleViewNotes = useCallback(() => {
    setShowNotesModal(true);
  }, []);

  const handleCloseNotesModal = useCallback(() => {
    setShowNotesModal(false);
  }, []);

  // Memorize handlers
  const handleOpenMemorize = useCallback(() => {
    setShowMemorize(true);
  }, []);

  const handleCloseMemorize = useCallback(() => {
    setShowMemorize(false);
  }, []);

  if (modulesLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0a12]' : 'bg-[#f7fafc]'}`}>
        <LoadingSpinner size="lg" text="Loading curriculum..." />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a12]' : 'bg-[#f7fafc]'}`}>
      {/* Confetti celebration */}
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Background elements - different for light/dark */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          // Dark mode: Animated gradient blobs
          <>
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
          </>
        ) : (
          // Light mode: Subtle blur elements
          <>
            <div className="blur-element w-[400px] h-[400px] bg-[#0098fc] top-[10%] right-[-100px]" />
            <div className="blur-element w-[300px] h-[300px] bg-accent-500 bottom-[20%] left-[-50px]" />
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark
          ? 'glass'
          : 'bg-[#f7fafc] shadow-acctual-lg'
      }`}>
        <div className="max-w-[1064px] mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
              isDark
                ? 'bg-gradient-to-br from-accent-500 to-accent-600 shadow-glow-green'
                : 'bg-gradient-to-br from-accent-500 to-accent-600'
            }`}>
              <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-black'}`}>
              Marketing Mastery
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              <div className="theme-toggle-thumb">
                {isDark ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>

            {/* Notes button */}
            <button
              onClick={handleViewNotes}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                isDark
                  ? 'text-white/60 hover:text-white'
                  : 'text-black/60 hover:text-black'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Notes
              {totalNotes > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full font-medium ${
                  isDark
                    ? 'bg-accent-500/20 text-accent-400'
                    : 'bg-accent-100 text-accent-700'
                }`}>
                  {totalNotes}
                </span>
              )}
            </button>

            {/* User greeting */}
            <span className={`text-sm hidden sm:block ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Welcome, <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{username}</span>
            </span>

            <button
              onClick={onLogout}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1064px] mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* Stats Cards Row - Floating style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Overall Progress Card */}
          <div className="float-card animate-float" style={{ animationDelay: '0s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-accent-500/20' : 'bg-accent-100'
              }`}>
                <svg className={`w-4 h-4 ${isDark ? 'text-accent-400' : 'text-accent-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-black/40'}`}>Overall</span>
            </div>
            <div className={`text-3xl font-bold ${isDark ? 'text-accent-400' : 'text-accent-500'}`}>{progressPercent}%</div>
            <div className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-black/40'}`}>Progress</div>
          </div>

          {/* Basic Completed Card */}
          <div className="float-card animate-float" style={{ animationDelay: '-1s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-primary-500/20' : 'bg-primary-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-primary-400' : 'bg-primary-500'}`} />
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-black/40'}`}>Basic</span>
            </div>
            <div className={`text-3xl font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{completedBasic}</div>
            <div className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-black/40'}`}>of {totalTopics} completed</div>
          </div>

          {/* Advanced Completed Card */}
          <div className="float-card animate-float" style={{ animationDelay: '-2s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-500'}`} />
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-black/40'}`}>Advanced</span>
            </div>
            <div className={`text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{completedAdvanced}</div>
            <div className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-black/40'}`}>of {totalTopics} completed</div>
          </div>

          {/* Modules Card */}
          <div className="float-card animate-float" style={{ animationDelay: '-3s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-amber-500/20' : 'bg-amber-100'
              }`}>
                <svg className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-black/40'}`}>Modules</span>
            </div>
            <div className={`text-3xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{modules.length}</div>
            <div className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-black/40'}`}>{totalTopics} topics total</div>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className={`rounded-2xl p-6 mb-8 transition-all duration-300 ${
          isDark
            ? 'glass-strong'
            : 'bg-white shadow-acctual-md'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Your Learning Journey</h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                {totalCompleted} of {totalPossible} lessons completed
              </p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${isDark ? 'text-accent-400' : 'text-accent-500'}`}>{progressPercent}%</div>
              <div className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className={`flex items-center gap-3 p-3 rounded-xl ${
              isDark ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-primary-50'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-primary-400' : 'bg-primary-500'}`} />
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-primary-300' : 'text-primary-700'}`}>Basic Level</div>
                <div className={`text-xs ${isDark ? 'text-primary-400/70' : 'text-primary-500'}`}>{completedBasic} / {totalTopics}</div>
              </div>
              <div className="ml-auto">
                <div className={`h-1.5 w-16 rounded-full overflow-hidden ${isDark ? 'bg-primary-500/20' : 'bg-primary-200'}`}>
                  <div
                    className={`h-full rounded-full ${isDark ? 'bg-primary-400' : 'bg-primary-500'}`}
                    style={{ width: `${totalTopics > 0 ? (completedBasic / totalTopics) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${
              isDark ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-500'}`} />
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>Advanced Level</div>
                <div className={`text-xs ${isDark ? 'text-purple-400/70' : 'text-purple-500'}`}>{completedAdvanced} / {totalTopics}</div>
              </div>
              <div className="ml-auto">
                <div className={`h-1.5 w-16 rounded-full overflow-hidden ${isDark ? 'bg-purple-500/20' : 'bg-purple-200'}`}>
                  <div
                    className={`h-full rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-500'}`}
                    style={{ width: `${totalTopics > 0 ? (completedAdvanced / totalTopics) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Modules</h2>
            <span className={`text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>{modules.length} modules</span>
          </div>
          {modules.map((module) => (
            <ModuleAccordion
              key={module.id}
              module={module}
              isBasicComplete={isBasicComplete}
              isAdvancedComplete={isAdvancedComplete}
              isAdvancedUnlocked={isAdvancedUnlocked}
              onTopicClick={handleTopicClick}
              isDark={isDark}
            />
          ))}
        </div>
      </main>

      {/* Content Modal */}
      {selectedTopic && !showQuiz && !showMemorize && (
        <ContentModal
          topic={selectedTopic}
          level={selectedLevel}
          content={modalContent}
          isLoading={isModalLoading || isGenerating}
          error={contentError}
          isComplete={
            selectedLevel === 'basic'
              ? isBasicComplete(selectedTopic.id)
              : isAdvancedComplete(selectedTopic.id)
          }
          onClose={handleCloseModal}
          onMarkComplete={handleMarkComplete}
          onTakeQuiz={handleTakeQuiz}
          onMemorize={handleOpenMemorize}
          isNoteSaved={handleIsNoteSaved}
          onToggleNote={handleToggleNote}
          totalSavedNotes={totalNotes}
          onViewNotes={handleViewNotes}
          progressScore={progressScore}
          streamingSections={streamingSections}
        />
      )}

      {/* Quiz Modal */}
      {selectedTopic && showQuiz && (
        <QuizModal
          topic={selectedTopic}
          level={selectedLevel}
          quiz={quizData}
          isLoading={isQuizLoading || isQuizGenerating}
          error={quizError}
          onClose={handleCloseQuiz}
        />
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <NotesModal
          notes={notes}
          onClose={handleCloseNotesModal}
          onRemoveNote={removeNote}
          onClearAll={clearAllNotes}
        />
      )}

      {/* Memorize Modal */}
      {selectedTopic && modalContent && showMemorize && (
        <MemorizeModal
          topic={selectedTopic}
          level={selectedLevel}
          content={modalContent}
          onClose={handleCloseMemorize}
        />
      )}
    </div>
  );
}
