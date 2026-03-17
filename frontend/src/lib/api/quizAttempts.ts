import { apiClient } from './client';
import { QuizAttemptResultDTO, QuizAnswerInput } from '@/types/quiz_attempt';

export async function submitQuizAttempt(quizID: string, answers: QuizAnswerInput[]): Promise<QuizAttemptResultDTO> {
  const res = await apiClient.post<QuizAttemptResultDTO>(`/quizzes/${quizID}/attempt`, { answers });
  return res.data;
}

export async function getMyQuizAttempt(quizID: string): Promise<QuizAttemptResultDTO> {
  const res = await apiClient.get<QuizAttemptResultDTO>(`/quizzes/${quizID}/my-attempt`);
  return res.data;
}
