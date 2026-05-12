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

export function useAIInsights() {
  return useQuery({
    queryKey: ['ai', 'insights'],
    queryFn: () => aiApi.getAIInsights(),
  })
}

export function useAssignmentFeedback() {
  return useMutation({
    mutationFn: (submissionId: string) => aiApi.getAssignmentFeedback(submissionId),
  })
}

export function useGenerateFlashcards() {
  return useMutation({
    mutationFn: ({ lessonId, numCards }: { lessonId: string; numCards: number }) =>
      aiApi.generateFlashcards(lessonId, numCards),
  })
}
