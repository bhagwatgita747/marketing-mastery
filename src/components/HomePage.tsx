import { useState, useCallback, useEffect } from 'react';
import { useModules } from '../hooks/useModules';
import { useProgress } from '../hooks/useProgress';
import { useContent } from '../hooks/useContent';
import { useQuiz } from '../hooks/useQuiz';
import { ModuleAccordion } from './ModuleAccordion';
import { ContentModal } from './ContentModal';
import { QuizModal } from './QuizModal';
import { LoadingSpinner } from './LoadingSpinner';
import { Confetti } from './Confetti';
import { Topic, Content, Quiz } from '../types';

interface HomePageProps {
  username: string;
  onLogout: () => void;
}

export function HomePage({ username, onLogout }: HomePageProps) {
  const { modules, isLoading: modulesLoading } = useModules();
  const {
    isBasicComplete,
    isAdvancedComplete,
    isAdvancedUnlocked,
    markBasicComplete,
    markAdvancedComplete,
  } = useProgress();
  const { fetchOrGenerateContent, isGenerating, error: contentError } = useContent();
  const { generateQuiz, isGenerating: isQuizGenerating, error: quizError } = useQuiz();

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

  if (modulesLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading curriculum..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Confetti celebration */}
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-500 sticky top-0 z-40 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-white text-lg">Marketing Mastery</h1>
                <p className="text-sm text-primary-100">Welcome back, {username}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Overall Progress Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8 overflow-hidden relative">
          {/* Decorative gradient blob */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary-200/40 to-accent-200/40 rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Big progress ring */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-slate-100"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="url(#progressGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${progressPercent * 2.136} 214`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">Your Progress</h2>
                <p className="text-sm text-slate-500">
                  {totalCompleted} of {totalPossible} lessons completed
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl p-4 border border-primary-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <p className="text-sm text-primary-600 font-medium">Basic</p>
              </div>
              <p className="text-2xl font-bold text-primary-700">{completedBasic}<span className="text-lg text-primary-400"> / {totalTopics}</span></p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100/50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <p className="text-sm text-purple-600 font-medium">Advanced</p>
              </div>
              <p className="text-2xl font-bold text-purple-700">{completedAdvanced}<span className="text-lg text-purple-400"> / {totalTopics}</span></p>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Modules</h2>
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
    </div>
  );
}
