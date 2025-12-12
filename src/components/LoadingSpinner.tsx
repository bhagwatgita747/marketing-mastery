interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  isDark?: boolean;
}

export function LoadingSpinner({ size = 'md', text, isDark = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-2 rounded-full animate-spin ${
          isDark
            ? 'border-white/20 border-t-accent-400'
            : 'border-slate-200 border-t-primary-600'
        }`}
      />
      {text && <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{text}</p>}
    </div>
  );
}
