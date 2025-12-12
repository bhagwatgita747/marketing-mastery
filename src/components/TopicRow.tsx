import { Topic } from '../types';

interface TopicRowProps {
  topic: Topic;
  isBasicComplete: boolean;
  isAdvancedComplete: boolean;
  isAdvancedUnlocked: boolean;
  onBasicClick: () => void;
  onAdvancedClick: () => void;
  isDark?: boolean;
}

export function TopicRow({
  topic,
  isBasicComplete,
  isAdvancedComplete,
  isAdvancedUnlocked,
  onBasicClick,
  onAdvancedClick,
  isDark = false,
}: TopicRowProps) {
  const bothComplete = isBasicComplete && isAdvancedComplete;

  return (
    <div className={`flex items-center justify-between py-4 px-5 transition-all duration-200 group ${
      bothComplete
        ? isDark ? 'bg-success-500/10' : 'bg-success-50/30'
        : isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-white/80'
    }`}>
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2">
          {bothComplete && (
            <span className="flex-shrink-0 w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          <h4 className={`text-sm font-medium truncate transition-colors ${
            bothComplete
              ? isDark ? 'text-success-400' : 'text-success-700'
              : isDark
                ? 'text-white/90 group-hover:text-white'
                : 'text-slate-800 group-hover:text-primary-700'
          }`}>
            {topic.title}
          </h4>
        </div>
        <p className={`text-xs truncate mt-0.5 ml-7 ${
          isDark ? 'text-white/40' : 'text-slate-500'
        }`}>
          {topic.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Basic Button */}
        <button
          onClick={onBasicClick}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            isBasicComplete
              ? 'bg-gradient-to-r from-success-400 to-success-500 text-white shadow-sm hover:shadow-md'
              : isDark
                ? 'bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-sm hover:shadow-md hover:from-primary-500 hover:to-primary-600'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm hover:shadow-md hover:from-primary-600 hover:to-primary-700'
          }`}
        >
          {isBasicComplete ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Basic
            </span>
          ) : (
            'Basic'
          )}
        </button>

        {/* Advanced Button */}
        <button
          onClick={onAdvancedClick}
          disabled={!isAdvancedUnlocked}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 transform ${
            isAdvancedComplete
              ? 'bg-gradient-to-r from-success-400 to-success-500 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
              : isAdvancedUnlocked
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
              : isDark
                ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          title={!isAdvancedUnlocked ? 'Complete Basic first' : undefined}
        >
          {isAdvancedComplete ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Advanced
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              {!isAdvancedUnlocked && (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
              Advanced
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
