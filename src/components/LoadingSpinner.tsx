interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  isDark?: boolean;
}

export function LoadingSpinner({ size = 'md', text, isDark = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'cube-loader--sm',
    md: 'cube-loader--md',
    lg: 'cube-loader--lg',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`cube-loader ${sizeClasses[size]} ${isDark ? 'cube-loader--dark' : 'cube-loader--light'}`}
        aria-label="Loading"
        role="status"
      />
      {text && <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{text}</p>}
    </div>
  );
}
