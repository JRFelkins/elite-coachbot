import React, { useState } from "react";
import { getTipForAnswer } from "../data/tips";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface CoachBotProps {
  isKnowledgeBaseLoaded: boolean;
}

export default function CoachBot({ isKnowledgeBaseLoaded }: CoachBotProps) {
  const [answer, setAnswer] = useState("");
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<"liked" | "disliked" | null>(null);

  const handleSubmit = async () => {
    if (!isKnowledgeBaseLoaded) {
      setTip("🔄 Loading knowledge base... please wait.");
      return;
    }

    setLoading(true);
    setFeedback(null);
    const response = await getTipForAnswer(answer);
    setTip(response?.text || "No tip found.");
    setLoading(false);
  };

  const handleFeedback = (type: "liked" | "disliked") => {
    setFeedback(type);
    // Here you could add analytics or save feedback to a database
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
        <div className="mt-4">
          <div className="p-3 bg-gray-100 border-l-4 border-blue-600">
            <p className="text-sm text-gray-800 italic">💡 {tip}</p>
          </div>
          
          <div className="mt-3 flex gap-2 justify-end">
            <button
              onClick={() => handleFeedback("liked")}
              className={`p-2 rounded-full transition-colors ${
                feedback === "liked"
                  ? "bg-green-100 text-green-600"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
              aria-label="Like this tip"
            >
              <ThumbsUp size={20} />
            </button>
            <button
              onClick={() => handleFeedback("disliked")}
              className={`p-2 rounded-full transition-colors ${
                feedback === "disliked"
                  ? "bg-red-100 text-red-600"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
              aria-label="Dislike this tip"
            >
              <ThumbsDown size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}