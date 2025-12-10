import { useState, useCallback } from 'react';
import { useModules } from '../hooks/useModules';
import { useProgress } from '../hooks/useProgress';
import { useContent } from '../hooks/useContent';
import { useQuiz } from '../hooks/useQuiz';
import { ModuleAccordion } from './ModuleAccordion';
import { ContentModal } from './ContentModal';
import { QuizModal } from './QuizModal';
import { ProgressBar } from './ProgressBar';
import { LoadingSpinner } from './LoadingSpinner';
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-slate-800">Marketing Mastery</h1>
                <p className="text-sm text-slate-500">Welcome back, {username}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Overall Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Your Progress</h2>
              <p className="text-sm text-slate-500">
                {totalCompleted} of {totalPossible} lessons completed
              </p>
            </div>
            <div className="w-full sm:w-64">
              <ProgressBar value={totalCompleted} max={totalPossible} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Basic Completed</p>
              <p className="text-2xl font-bold text-blue-700">{completedBasic} / {totalTopics}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Advanced Completed</p>
              <p className="text-2xl font-bold text-purple-700">{completedAdvanced} / {totalTopics}</p>
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
