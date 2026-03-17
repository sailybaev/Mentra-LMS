import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as quizApi from '@/lib/api/quiz'
import { CreateQuizInput, UpdateQuizInput } from '@/lib/api/quiz'

export const quizKeys = {
  all: ['quiz'] as const,
  byLesson: (lessonId: string) => [...quizKeys.all, 'lesson', lessonId] as const,
  detail: (quizId: string) => [...quizKeys.all, 'detail', quizId] as const,
}

export function useQuizByLesson(lessonId: string) {
  return useQuery({
    queryKey: quizKeys.byLesson(lessonId),
    queryFn: () => quizApi.getQuizByLesson(lessonId),
    enabled: !!lessonId,
    retry: false,
  })
}

export function useCreateQuiz(lessonId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateQuizInput) => quizApi.createQuiz(lessonId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: quizKeys.byLesson(lessonId) })
    },
  })
}

export function useUpdateQuiz(lessonId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: UpdateQuizInput }) =>
      quizApi.updateQuiz(quizId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: quizKeys.byLesson(lessonId) })
    },
  })
}
