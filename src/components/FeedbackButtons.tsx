import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

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
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={onLike}
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