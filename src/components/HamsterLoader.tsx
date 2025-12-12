interface HamsterLoaderProps {
  isDark?: boolean;
  text?: string;
}

export function HamsterLoader({ isDark = false, text }: HamsterLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className="wheel-and-hamster"
        aria-label="Loading animation"
        role="status"
      >
        <div className={`wheel ${isDark ? 'wheel--dark' : 'wheel--light'}`}></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className={`spoke ${isDark ? 'spoke--dark' : 'spoke--light'}`}></div>
      </div>
      {text && (
        <p className={`mt-6 text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
          {text}
        </p>
      )}
    </div>
  );
}
