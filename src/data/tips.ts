import { queryKnowledgeBase, type CoachingTip } from "../utils/rag";

export type { CoachingTip };

export async function getTipForAnswer(answer: string): Promise<CoachingTip | null> {
  return await queryKnowledgeBase(answer);
}