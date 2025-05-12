import { Configuration, OpenAIApi } from "openai";

// Load OpenAI API key from .env
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith("sk-")) {
  throw new Error("❌ OpenAI API key is missing or invalid. Please check your .env file.");
}

const configuration = new Configuration({
  apiKey,
});

const openai = new OpenAIApi(configuration);

export interface CoachingTip {
  text: string;
  metadata: {
    category: string;
  };
  embedding?: number[];
}

let knowledgeBase: CoachingTip[] = [];
let hasInitialized = false;

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

export async function initializeRAG() {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  }
}

export async function addToKnowledgeBase(content: string) {
  if (hasInitialized) return;
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  }

  const tips = content.split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line) as CoachingTip);

  knowledgeBase = tips;

  for (const tip of knowledgeBase) {
    if (!tip.embedding) {
      const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: tip.text,
      });
      tip.embedding = response.data.data[0].embedding;
      // Pause briefly to avoid OpenAI rate limits
      await new Promise(res => setTimeout(res, 200));
    }
  }

  hasInitialized = true;
}
  
export async function queryKnowledgeBase(query: string): Promise<CoachingTip | null> {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  }

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