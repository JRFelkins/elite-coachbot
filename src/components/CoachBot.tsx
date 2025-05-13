import React, { useState } from "react";
import { questions } from "../data/questions";

interface UserState {
  seen: Set<string>;
  liked: Set<string>;
  skipped: Set<string>;
  lastCategory: string | null;
}

function getNextAdaptiveQuestion(userState: UserState) {
  // Filter out questions that have been seen
  const unseenQuestions = questions.filter(q => !userState.seen.has(q.text));
  
  if (unseenQuestions.length === 0) {
    return null;
  }

  // If there are questions from a different category than the last one, prioritize those
  const differentCategoryQuestions = unseenQuestions.filter(q => 
    userState.lastCategory === null || q.category !== userState.lastCategory
  );

  // Choose from different category questions if available, otherwise from all unseen
  const availableQuestions = differentCategoryQuestions.length > 0 
    ? differentCategoryQuestions 
    : unseenQuestions;

  // Return a random question from the available ones
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
}

export default function CoachBot() {
  const [userState, setUserState] = useState<UserState>({
    seen: new Set(),
    liked: new Set(),
    skipped: new Set(),
    lastCategory: null
  });

  const [currentQuestion, setCurrentQuestion] = useState(() => getNextAdaptiveQuestion({
    seen: new Set(),
    liked: new Set(),
    skipped: new Set(),
    lastCategory: null
  }));

  const [feedback, setFeedback] = useState("");

  const handleNext = () => {
    if (currentQuestion) {
      userState.seen.add(currentQuestion.text);
      userState.lastCategory = currentQuestion.category;
    }

    const next = getNextAdaptiveQuestion(userState);
    setCurrentQuestion(next);
    setFeedback("");
    setUserState({ ...userState });
  };

  const handleLike = () => {
    if (currentQuestion) {
      userState.liked.add(currentQuestion.text);
    }
    handleNext();
  };

  const handleSkip = () => {
    if (currentQuestion) {
      userState.skipped.add(currentQuestion.text);
    }
    handleNext();
  };

  return (
    <div className="p-4 max-w-xl mx-auto rounded-xl bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">ELITE CoachBot 🧠</h2>

      {currentQuestion ? (
        <>
          <div className="mb-4 p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-900 rounded">
            <p className="text-lg font-medium">{currentQuestion.text}</p>
            <p className="text-xs text-blue-700 italic mt-1">Category: {currentQuestion.category}</p>
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="Write your answer here..."
            className="w-full p-2 mb-2 border rounded"
          />

          <div className="flex gap-2">
            <button onClick={handleLike} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              👍 Like
            </button>
            <button onClick={handleSkip} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              ⏭️ Skip
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600 mt-8">
          🎉 You've answered all available questions!
        </div>
      )}
    </div>
  );
}