import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as enrollmentsApi from '@/lib/api/enrollments'
import { CreateEnrollmentInput } from '@/types/enrollment'

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  list: (courseId: string) => [...enrollmentKeys.all, 'list', courseId] as const,
}

// Treats 404 as empty array — endpoints not yet implemented
export function useEnrollments(courseId: string) {
  return useQuery({
    queryKey: enrollmentKeys.list(courseId),
    queryFn: () => enrollmentsApi.listEnrollments(courseId),
    enabled: !!courseId,
  })
}

export function useCreateEnrollment(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEnrollmentInput) => enrollmentsApi.createEnrollment(courseId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: enrollmentKeys.list(courseId) }),
  })
}

export function useDeleteEnrollment(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (enrollmentId: string) => enrollmentsApi.deleteEnrollment(courseId, enrollmentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: enrollmentKeys.list(courseId) }),
  })
}
