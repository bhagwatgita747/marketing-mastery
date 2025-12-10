import { Topic } from '../types';

interface TopicRowProps {
  topic: Topic;
  isBasicComplete: boolean;
  isAdvancedComplete: boolean;
  isAdvancedUnlocked: boolean;
  onBasicClick: () => void;
  onAdvancedClick: () => void;
}

export function TopicRow({
  topic,
  isBasicComplete,
  isAdvancedComplete,
  isAdvancedUnlocked,
  onBasicClick,
  onAdvancedClick,
}: TopicRowProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-slate-50 rounded-lg transition-colors">
      <div className="flex-1 min-w-0 mr-4">
        <h4 className="text-sm font-medium text-slate-800 truncate">{topic.title}</h4>
        <p className="text-xs text-slate-500 truncate">{topic.subtitle}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Basic Button */}
        <button
          onClick={onBasicClick}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            isBasicComplete
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          {isBasicComplete ? (
            <span className="flex items-center gap-1">
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
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            isAdvancedComplete
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              : isAdvancedUnlocked
              ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          title={!isAdvancedUnlocked ? 'Complete Basic first' : undefined}
        >
          {isAdvancedComplete ? (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Advanced
            </span>
          ) : (
            <span className="flex items-center gap-1">
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
