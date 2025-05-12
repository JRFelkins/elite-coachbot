import React from 'react';

interface QuestionProps {
  question: string;
  isTransitioning: boolean;
  slideDirection: 'left' | 'right';
}

const Question: React.FC<QuestionProps> = ({ question, isTransitioning, slideDirection }) => {
  return (
    <div 
      className={`bg-white/5 p-5 rounded-lg border-l-4 border-blue-500 transform transition-all duration-300 ease-in-out flex-1 ${
        isTransitioning 
          ? `opacity-0 ${slideDirection === 'left' ? '-translate-x-full' : 'translate-x-full'}`
          : 'opacity-100 translate-x-0'
      }`}
    >
      <p className="text-lg font-medium text-blue-50">{question}</p>
    </div>
  );
};

export default Question;