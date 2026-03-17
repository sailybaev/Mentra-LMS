import { apiClient } from './client'
import { QuizDTO, GenerateQuizInput } from '@/types/quiz'
import { InsightsDTO } from '@/types/progress'

export async function generateQuiz(input: GenerateQuizInput): Promise<QuizDTO> {
  const res = await apiClient.post<QuizDTO>('/ai/generate-quiz', input)
  return res.data
}

export async function summarizeLesson(lessonId: string): Promise<{ summary: string }> {
  const res = await apiClient.post<{ summary: string }>('/ai/summarize', { lesson_id: lessonId })
  return res.data
}

export async function getAIInsights(courseId: string): Promise<InsightsDTO> {
  const res = await apiClient.get<InsightsDTO>(`/ai/insights/${courseId}`)
  return res.data
}
