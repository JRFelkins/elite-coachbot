import React, { useState } from 'react';
import { MessageCircle, Send, SkipForward } from 'lucide-react';
import { coachingQuestions } from '../data/questions';
import { getTipForAnswer, type CoachingTip } from '../data/tips';
import Question from './Question';
import FeedbackButtons from './FeedbackButtons';
import CoachingTip from './CoachingTip';

interface CoachBotProps {
  isKnowledgeBaseLoaded: boolean;
}

const CoachBot: React.FC<CoachBotProps> = ({ isKnowledgeBaseLoaded }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Record<number, boolean>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [currentTip, setCurrentTip] = useState<CoachingTip | null>(null);
  const [showTip, setShowTip] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalQuestions = coachingQuestions.length;
  const currentQuestion = coachingQuestions[currentQuestionIndex];

  const handleSkip = () => {
    if (isTransitioning) return;
    setShowTip(false);
    setSlideDirection('right');
    goToNextQuestion();
  };

  const handleFeedback = (liked: boolean) => {
    if (isTransitioning) return;
    
    setFeedback(prev => ({
      ...prev,
      [currentQuestionIndex]: liked
    }));
    
    if (!answeredQuestions.includes(currentQuestionIndex)) {
      setAnsweredQuestions(prev => [...prev, currentQuestionIndex]);
    }
    
    saveCurrentAnswer(liked);
    setShowTip(false);
    setSlideDirection('left');
    goToNextQuestion();
  };

  const saveCurrentAnswer = (feedbackValue?: boolean) => {
    if (currentAnswer.trim()) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: {
          text: currentAnswer.trim(),
          feedback: feedbackValue
        }
      }));
    }
  };

  const handleSubmit = async () => {
    if (!currentAnswer.trim() || !isKnowledgeBaseLoaded) return;
    
    setIsProcessing(true);
    saveCurrentAnswer();
    
    try {
      const newTip = await getTipForAnswer(currentAnswer);
      setCurrentTip(newTip);
      setShowTip(true);
    } catch (error) {
      console.error('Error getting tip:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToNextQuestion = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestionIndex(prev => 
        prev === totalQuestions - 1 ? 0 : prev + 1
      );
      setCurrentAnswer('');
      setShowTip(false);
      setCurrentTip(null);
      setIsTransitioning(false);
    }, 300);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentAnswer(e.target.value);
    setShowTip(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden transition-all duration-300 border border-white/20">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex items-center">
        <MessageCircle className="text-blue-100 mr-2" size={24} />
        <h2 className="text-xl text-blue-50 font-bold">Elite Coaching Session</h2>
      </div>
      
      <div className="min-h-[300px] px-6 py-8 flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-start gap-4">
            <Question 
              question={currentQuestion}
              isTransitioning={isTransitioning}
              slideDirection={slideDirection}
            />
            <button
              onClick={handleSkip}
              disabled={isTransitioning}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 text-blue-200 transition-colors duration-200 disabled:opacity-50 mt-1 border border-white/10"
              aria-label="Skip this question"
            >
              <SkipForward size={24} />
            </button>
          </div>
          
          <div className={`mt-6 transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <div className="relative">
              <textarea
                value={currentAnswer}
                onChange={handleAnswerChange}
                placeholder={isKnowledgeBaseLoaded ? "Type your answer here..." : "Loading knowledge base..."}
                className="w-full min-h-[120px] p-4 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none pr-12 text-blue-50 placeholder-blue-200/50"
                disabled={isTransitioning || isProcessing || !isKnowledgeBaseLoaded}
              />
              <button
                onClick={handleSubmit}
                disabled={!currentAnswer.trim() || isTransitioning || isProcessing || !isKnowledgeBaseLoaded}
                className="absolute bottom-4 right-4 p-2 text-blue-200 hover:text-blue-100 disabled:text-blue-900/20 transition-colors"
                aria-label="Submit answer"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          
          {showTip && currentTip && (
            <div className="mt-4">
              <CoachingTip tip={currentTip} isTransitioning={isTransitioning} />
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-4 mt-6">
          <FeedbackButtons 
            onLike={() => handleFeedback(true)}
            onDislike={() => handleFeedback(false)}
            disabled={isTransitioning}
          />
        </div>
      </div>
    </div>
  );
};

export default CoachBot;