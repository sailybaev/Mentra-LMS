import { apiClient } from './client'
import { ProgressDTO, InsightsDTO, CourseProgressSummary } from '@/types/progress'

export async function markLessonComplete(lessonId: string, score?: number): Promise<ProgressDTO> {
  const res = await apiClient.post<ProgressDTO>(`/progress/lessons/${lessonId}/complete`, { score })
  return res.data
}

export async function getProgress(courseId?: string): Promise<ProgressDTO[]> {
  const res = await apiClient.get('/progress', {
    params: courseId ? { course_id: courseId } : undefined,
  })
  return Array.isArray(res.data) ? res.data : (res.data?.data ?? [])
}

export async function getCourseProgressSummary(courseId: string): Promise<CourseProgressSummary> {
  const res = await apiClient.get<CourseProgressSummary>(`/progress/summary/${courseId}`)
  return res.data
}

export async function getInsights(courseId: string): Promise<InsightsDTO> {
  const res = await apiClient.get<InsightsDTO>(`/ai/insights/${courseId}`)
  return res.data
}
