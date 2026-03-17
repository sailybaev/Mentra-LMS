import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as coursesApi from '@/lib/api/courses'
import { CreateCourseInput, UpdateCourseInput } from '@/types/course'

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
}

export function useCourses(params?: { page?: number; page_size?: number }) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => coursesApi.listCourses(params),
  })
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => coursesApi.getCourse(id),
    enabled: !!id,
  })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCourseInput) => coursesApi.createCourse(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.lists() }),
  })
}

export function useUpdateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCourseInput }) =>
      coursesApi.updateCourse(id, input),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: courseKeys.detail(id) })
      qc.invalidateQueries({ queryKey: courseKeys.lists() })
    },
  })
}

export function useDeleteCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => coursesApi.deleteCourse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.lists() }),
  })
}
