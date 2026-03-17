import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as lessonsApi from '@/lib/api/lessons'
import { CreateLessonInput, UpdateLessonInput } from '@/types/lesson'

export const lessonKeys = {
  all: ['lessons'] as const,
  lists: () => [...lessonKeys.all, 'list'] as const,
  list: (moduleId: string) => [...lessonKeys.lists(), moduleId] as const,
  details: () => [...lessonKeys.all, 'detail'] as const,
  detail: (moduleId: string, lessonId: string) => [...lessonKeys.details(), moduleId, lessonId] as const,
}

export function useLessons(moduleId: string) {
  return useQuery({
    queryKey: lessonKeys.list(moduleId),
    queryFn: () => lessonsApi.listLessons(moduleId),
    enabled: !!moduleId,
  })
}

export function useLesson(moduleId: string, lessonId: string) {
  return useQuery({
    queryKey: lessonKeys.detail(moduleId, lessonId),
    queryFn: () => lessonsApi.getLesson(moduleId, lessonId),
    enabled: !!(moduleId && lessonId),
  })
}

export function useCreateLesson(moduleId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateLessonInput) => lessonsApi.createLesson(moduleId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: lessonKeys.list(moduleId) }),
  })
}

export function useUpdateLesson(moduleId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLessonInput }) =>
      lessonsApi.updateLesson(moduleId, id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: lessonKeys.list(moduleId) }),
  })
}

export function useDeleteLesson(moduleId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: string) => lessonsApi.deleteLesson(moduleId, lessonId),
    onSuccess: () => qc.invalidateQueries({ queryKey: lessonKeys.list(moduleId) }),
  })
}
