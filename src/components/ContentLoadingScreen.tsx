import { HamsterLoader } from './HamsterLoader';

interface ContentLoadingScreenProps {
  topicTitle: string;
  score: number;
  isDark?: boolean;
}

export function ContentLoadingScreen({ isDark = false }: ContentLoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <HamsterLoader isDark={isDark} text="Loading..." />
    </div>
  );
}
