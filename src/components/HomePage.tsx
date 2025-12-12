import { useState, useCallback, useEffect, useMemo } from 'react';
import { useModules } from '../hooks/useModules';
import { useProgress } from '../hooks/useProgress';
import { useContent } from '../hooks/useContent';
import { useQuiz } from '../hooks/useQuiz';
import { useNotes } from '../hooks/useNotes';
import { ModuleAccordion } from './ModuleAccordion';
import { ContentModal } from './ContentModal';
import { QuizModal } from './QuizModal';
import { NotesModal } from './NotesModal';
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
  const { fetchOrGenerateContent, isGenerating, error: contentError } = useContent();
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
    setSelectedTopic(topic);
    setSelectedLevel(level);
    setModalContent(null);
    setIsModalLoading(true);

    const content = await fetchOrGenerateContent(topic, level);
    setModalContent(content);
    setIsModalLoading(false);
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

  if (modulesLoading) {
    return (
      <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading curriculum..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafc]">
      {/* Confetti celebration */}
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blur-element w-[400px] h-[400px] bg-[#0098fc] top-[10%] right-[-100px]" />
        <div className="blur-element w-[300px] h-[300px] bg-accent-500 bottom-[20%] left-[-50px]" />
      </div>

      {/* Navigation - Acctual style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f7fafc] shadow-acctual-lg">
        <div className="max-w-[1064px] mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-black">Marketing Mastery</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notes button */}
            <button
              onClick={handleViewNotes}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-black/60 hover:text-black transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Notes
              {totalNotes > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-accent-100 text-accent-700 rounded-full font-medium">
                  {totalNotes}
                </span>
              )}
            </button>

            {/* User greeting */}
            <span className="text-sm text-black/60 hidden sm:block">
              Welcome, <span className="font-medium text-black">{username}</span>
            </span>

            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
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
              <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-xs font-medium text-black/40">Overall</span>
            </div>
            <div className="text-3xl font-bold text-accent-500">{progressPercent}%</div>
            <div className="text-xs text-black/40 mt-1">Progress</div>
          </div>

          {/* Basic Completed Card */}
          <div className="float-card animate-float" style={{ animationDelay: '-1s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
              </div>
              <span className="text-xs font-medium text-black/40">Basic</span>
            </div>
            <div className="text-3xl font-bold text-primary-600">{completedBasic}</div>
            <div className="text-xs text-black/40 mt-1">of {totalTopics} completed</div>
          </div>

          {/* Advanced Completed Card */}
          <div className="float-card animate-float" style={{ animationDelay: '-2s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
              </div>
              <span className="text-xs font-medium text-black/40">Advanced</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">{completedAdvanced}</div>
            <div className="text-xs text-black/40 mt-1">of {totalTopics} completed</div>
          </div>

          {/* Modules Card */}
          <div className="float-card animate-float" style={{ animationDelay: '-3s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xs font-medium text-black/40">Modules</span>
            </div>
            <div className="text-3xl font-bold text-amber-600">{modules.length}</div>
            <div className="text-xs text-black/40 mt-1">{totalTopics} topics total</div>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="bg-white rounded-2xl shadow-acctual-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-black">Your Learning Journey</h2>
              <p className="text-sm text-black/50 mt-1">
                {totalCompleted} of {totalPossible} lessons completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-accent-500">{progressPercent}%</div>
              <div className="text-xs text-black/40">complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <div>
                <div className="text-sm font-medium text-primary-700">Basic Level</div>
                <div className="text-xs text-primary-500">{completedBasic} / {totalTopics}</div>
              </div>
              <div className="ml-auto">
                <div className="h-1.5 w-16 bg-primary-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${totalTopics > 0 ? (completedBasic / totalTopics) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <div>
                <div className="text-sm font-medium text-purple-700">Advanced Level</div>
                <div className="text-xs text-purple-500">{completedAdvanced} / {totalTopics}</div>
              </div>
              <div className="ml-auto">
                <div className="h-1.5 w-16 bg-purple-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
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
            <h2 className="text-lg font-semibold text-black">Modules</h2>
            <span className="text-sm text-black/40">{modules.length} modules</span>
          </div>
          {modules.map((module) => (
            <ModuleAccordion
              key={module.id}
              module={module}
              isBasicComplete={isBasicComplete}
              isAdvancedComplete={isAdvancedComplete}
              isAdvancedUnlocked={isAdvancedUnlocked}
              onTopicClick={handleTopicClick}
            />
          ))}
        </div>
      </main>

      {/* Content Modal */}
      {selectedTopic && !showQuiz && (
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
          isNoteSaved={handleIsNoteSaved}
          onToggleNote={handleToggleNote}
          totalSavedNotes={totalNotes}
          onViewNotes={handleViewNotes}
          progressScore={progressScore}
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
    </div>
  );
}
