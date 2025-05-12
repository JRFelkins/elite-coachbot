import React from 'react';
import { Lightbulb } from 'lucide-react';
import type { CoachingTip as CoachingTipType } from '../data/tips';

interface CoachingTipProps {
  tip: CoachingTipType;
  isTransitioning: boolean;
}

const CoachingTip: React.FC<CoachingTipProps> = ({ tip, isTransitioning }) => {
  return (
    <div className={`flex items-start gap-3 bg-emerald-500/10 p-4 rounded-lg border-l-4 border-emerald-500 transition-all duration-300 ${
      isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
    }`}>
      <Lightbulb className="text-emerald-400 flex-shrink-0" size={20} />
      <p className="text-sm text-emerald-200">{tip.text}</p>
    </div>
  );
}

export default CoachingTip;