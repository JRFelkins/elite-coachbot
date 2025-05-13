import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  disabled: boolean;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ 
  onLike, 
  onDislike, 
  disabled 
}) => {
  const handleLike = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#4ade80', '#22c55e', '#16a34a'],
    });
    onLike();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={handleLike}
        disabled={disabled}
        className="flex flex-col items-center justify-center p-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors duration-200 disabled:opacity-50 border border-emerald-500/20"
        aria-label="Like this question"
      >
        <ThumbsUp size={28} className="mb-1" />
        <span className="text-sm">Helpful</span>
      </button>
      
      <button
        onClick={onDislike}
        disabled={disabled}
        className="flex flex-col items-center justify-center p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors duration-200 disabled:opacity-50 border border-red-500/20"
        aria-label="Dislike this question"
      >
        <ThumbsDown size={28} className="mb-1" />
        <span className="text-sm">Not Helpful</span>
      </button>
    </div>
  );
};

export default FeedbackButtons;