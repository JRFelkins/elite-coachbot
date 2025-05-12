import { Configuration, OpenAIApi } from "openai";
import tipsData from "../data/coachbot_tips_formatted.json";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type CoachingTip = {
  text: string;
  category: string;
  embedding?: number[];
};

let knowledgeBase: CoachingTip[] = [];

export async function addToKnowledgeBase() {
  knowledgeBase = [...tipsData];

  for (const tip of knowledgeBase) {
    if (!tip.embedding) {
      const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: tip.text,
      });
      tip.embedding = response.data.data[0].embedding;
    }
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

export async function queryKnowledgeBase(query: string): Promise<CoachingTip | null> {
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: query,
  });
  const queryEmbedding = response.data.data[0].embedding;

  const bestMatch = knowledgeBase.reduce(
    (best, tip) => {
      const similarity = cosineSimilarity(queryEmbedding, tip.embedding!);
      return similarity > best.similarity ? { tip, similarity } : best;
    },
    { tip: null as CoachingTip | null, similarity: -Infinity }
  );

  return bestMatch.tip;
}
