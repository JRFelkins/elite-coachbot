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
    // Create a vibrant multi-colored celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#4ade80', '#22c55e', '#16a34a', '#facc15', '#fbbf24', '#f59e0b', '#3b82f6', '#60a5fa', '#818cf8'],
      ticks: 100,
      startVelocity: 30,
      shapes: ['circle', 'square'],
      scalar: 1.2
    });
    onLike();
  };

  const handleDislike = () => {
    // Create multi-colored particles that fall down with a more dramatic effect
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
      gravity: 3,
      scalar: 0.5,
      ticks: 75,
      shapes: ['square'],
      drift: -2
    });
    
    // Add shake animation to the button
    const button = document.querySelector('[data-dislike-button]');
    button?.classList.add('shake-animation');
    setTimeout(() => button?.classList.remove('shake-animation'), 500);
    
    onDislike();
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
        onClick={handleDislike}
        disabled={disabled}
        data-dislike-button
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