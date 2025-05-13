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
  console.log('🚀 Initializing RAG system...');
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  }
  console.log('✅ OpenAI API key validated');
}

export async function addToKnowledgeBase(content: string) {
  if (hasInitialized) {
    console.log('📚 Knowledge base already initialized, skipping...');
    return;
  }
  
  console.log('📚 Adding content to knowledge base...');
  
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  }

  const tips = content.split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line) as CoachingTip);

  console.log(`📝 Parsed ${tips.length} coaching tips`);
  knowledgeBase = tips;

  console.log('🔄 Creating embeddings for tips...');
  for (const tip of knowledgeBase) {
    if (!tip.embedding) {
      try {
        console.log(`Creating embedding for: "${tip.text.substring(0, 50)}..."`);
        const response = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: tip.text,
        });
        tip.embedding = response.data.data[0].embedding;
        console.log('✅ Embedding created successfully');
        // Pause briefly to avoid OpenAI rate limits
        await new Promise(res => setTimeout(res, 200));
      } catch (error) {
        console.error('❌ Error creating embedding:', error);
        throw error;
      }
    }
  }

  hasInitialized = true;
  console.log('✅ Knowledge base initialization complete');
}
  
export async function queryKnowledgeBase(query: string): Promise<CoachingTip | null> {
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  }

  if (knowledgeBase.length === 0) {
    console.warn('⚠️ Knowledge base is empty');
    return null;
  }

  console.log(`🔍 Querying knowledge base with: "${query}"`);

  try {
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

    console.log(`✅ Found matching tip with similarity: ${bestMatch.similarity.toFixed(3)}`);
    return bestMatch.tip;
  } catch (error) {
    console.error('❌ Error querying knowledge base:', error);
    throw error;
  }
}