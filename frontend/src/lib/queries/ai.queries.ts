import { useMutation, useQuery } from '@tanstack/react-query'
import * as aiApi from '@/lib/api/ai'
import { GenerateQuizInput } from '@/types/quiz'

export function useGenerateQuiz() {
  return useMutation({
    mutationFn: (input: GenerateQuizInput) => aiApi.generateQuiz(input),
  })
}

export function useSummarizeLesson() {
  return useMutation({
    mutationFn: (lessonId: string) => aiApi.summarizeLesson(lessonId),
  })
}

export function useAIInsights(courseId: string) {
  return useQuery({
    queryKey: ['ai', 'insights', courseId],
    queryFn: () => aiApi.getAIInsights(courseId),
    enabled: !!courseId,
  })
}
