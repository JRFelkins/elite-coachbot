import React, { useState } from "react";
import { getTipForAnswer } from "../data/tips";

interface CoachBotProps {
  isKnowledgeBaseLoaded: boolean;
}

export default function CoachBot({ isKnowledgeBaseLoaded }: CoachBotProps) {
  const [answer, setAnswer] = useState("");
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!isKnowledgeBaseLoaded) {
      setTip("🔄 Loading knowledge base... please wait.");
      return;
    }

    setLoading(true);
    const response = await getTipForAnswer(answer);
    setTip(response?.text || "No tip found.");
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto rounded-xl bg-white shadow-md">
      <h2 className="text-xl font-bold mb-2">ELITE CoachBot 🧠</h2>
      <p className="mb-2 text-gray-600">Coach Question:</p>
      
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={4}
        placeholder="Type your challenge here..."
        className="w-full p-2 border border-gray-300 rounded"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !answer.trim()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Thinking..." : "Get Tip"}
      </button>

      {tip && (
        <div className="mt-4 p-3 bg-gray-100 border-l-4 border-blue-600">
          <p className="text-sm text-gray-800 italic">💡 {tip}</p>
        </div>
      )}
    </div>
  );
}