import { useState, useEffect } from 'react';
import { Topic, Quiz, QuizQuestion } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface QuizModalProps {
  topic: Topic;
  level: 'basic' | 'advanced';
  quiz: Quiz | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

export function QuizModal({
  topic,
  level,
  quiz,
  isLoading,
  error,
  onClose,
}: QuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

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

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const currentQuestion: QuizQuestion | null = quiz?.questions[currentIndex] || null;
  const totalQuestions = quiz?.questions.length || 0;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    setIsAnswered(true);
    if (selectedAnswer === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setShowResults(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const getOptionClass = (index: number) => {
    const base = 'w-full p-4 rounded-xl border-2 text-left transition-all duration-200';

    if (!isAnswered) {
      if (selectedAnswer === index) {
        return `${base} border-blue-500 bg-blue-50 ring-2 ring-blue-200`;
      }
      return `${base} border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer`;
    }

    // After answering
    if (index === currentQuestion?.correctIndex) {
      return `${base} border-emerald-500 bg-emerald-50`;
    }
    if (selectedAnswer === index && index !== currentQuestion?.correctIndex) {
      return `${base} border-red-500 bg-red-50`;
    }
    return `${base} border-slate-200 bg-slate-50 opacity-50`;
  };

  const getScoreMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return { emoji: '🏆', message: 'Perfect score! You\'ve mastered this topic!' };
    if (percentage >= 80) return { emoji: '🎉', message: 'Excellent work! You have a strong understanding.' };
    if (percentage >= 60) return { emoji: '👍', message: 'Good job! Review the content to strengthen your knowledge.' };
    return { emoji: '📚', message: 'Keep learning! Review the content and try again.' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Progress bar */}
        {!isLoading && quiz && !showResults && (
          <div className="h-1 bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                Quiz
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                level === 'basic' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {level === 'basic' ? 'Basic' : 'Advanced'}
              </span>
              {quiz && !showResults && (
                <span className="text-xs text-slate-500">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-slate-800">{topic.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="lg" text="Generating quiz questions..." />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
              <p className="font-medium">Error loading quiz</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : showResults ? (
            // Results screen
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{getScoreMessage().emoji}</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                You scored {score} out of {totalQuestions}
              </h3>
              <p className="text-slate-600 mb-6">{getScoreMessage().message}</p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : currentQuestion ? (
            // Question
            <div>
              <h3 className="text-xl font-medium text-slate-800 mb-6">
                {currentQuestion.question}
              </h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={isAnswered}
                    className={getOptionClass(index)}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                        isAnswered && index === currentQuestion.correctIndex
                          ? 'bg-emerald-500 text-white'
                          : isAnswered && selectedAnswer === index
                          ? 'bg-red-500 text-white'
                          : selectedAnswer === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-slate-700">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanation after answering */}
              {isAnswered && (
                <div className={`mt-6 p-4 rounded-xl ${
                  selectedAnswer === currentQuestion.correctIndex
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {selectedAnswer === currentQuestion.correctIndex ? '✅' : '💡'}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">
                        {selectedAnswer === currentQuestion.correctIndex ? 'Correct!' : 'Not quite right'}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!isLoading && quiz && !showResults && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="text-sm text-slate-500">
              Score: {score}/{currentIndex + (isAnswered ? 1 : 0)}
            </div>

            {!isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {currentIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
