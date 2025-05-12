import { queryKnowledgeBase } from "../utils/rag";

export async function getTipForAnswer(answer: string) {
  return await queryKnowledgeBase(answer);
}
