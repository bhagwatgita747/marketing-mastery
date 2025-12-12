import Lottie from 'lottie-react';
import paperplaneAnimation from '../assets/paperplane.json';

interface ContentLoadingScreenProps {
  topicTitle: string;
  score: number;
  isDark?: boolean;
}

export function ContentLoadingScreen({ isDark = false }: ContentLoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Lottie Animation */}
      <div className="w-64 h-48 mb-4">
        <Lottie
          animationData={paperplaneAnimation}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Simple loading text */}
      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Loading...</p>
    </div>
  );
}
