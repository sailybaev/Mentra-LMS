import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as progressApi from '@/lib/api/progress'

export const progressKeys = {
  all: ['progress'] as const,
  list: (courseId?: string) => [...progressKeys.all, 'list', courseId] as const,
  summary: (courseId: string) => [...progressKeys.all, 'summary', courseId] as const,
  insights: (courseId: string) => [...progressKeys.all, 'insights', courseId] as const,
}

export function useProgress(courseId?: string) {
  return useQuery({
    queryKey: progressKeys.list(courseId),
    queryFn: () => progressApi.getProgress(courseId),
  })
}

export function useCourseProgressSummary(courseId: string) {
  return useQuery({
    queryKey: progressKeys.summary(courseId),
    queryFn: () => progressApi.getCourseProgressSummary(courseId),
    enabled: !!courseId,
  })
}

export function useInsights(courseId: string) {
  return useQuery({
    queryKey: progressKeys.insights(courseId),
    queryFn: () => progressApi.getInsights(courseId),
    enabled: !!courseId,
  })
}

export function useMarkComplete() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ lessonId, score }: { lessonId: string; score?: number }) =>
      progressApi.markLessonComplete(lessonId, score),
    onSuccess: () => qc.invalidateQueries({ queryKey: progressKeys.all }),
  })
}
