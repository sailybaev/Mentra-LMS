import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as courseTeachersApi from '@/lib/api/courseTeachers'
import { AssignTeacherInput } from '@/types/course_teacher'

export const courseTeacherKeys = {
  all: ['course-teachers'] as const,
  byCourse: (courseId: string) => [...courseTeacherKeys.all, courseId] as const,
}

export function useCourseTeachers(courseId: string) {
  return useQuery({
    queryKey: courseTeacherKeys.byCourse(courseId),
    queryFn: () => courseTeachersApi.listCourseTeachers(courseId),
    enabled: !!courseId,
  })
}

export function useAssignTeacher(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AssignTeacherInput) => courseTeachersApi.assignTeacher(courseId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseTeacherKeys.byCourse(courseId) }),
  })
}

export function useRemoveTeacher(courseId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (teacherId: string) => courseTeachersApi.removeTeacher(courseId, teacherId),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseTeacherKeys.byCourse(courseId) }),
  })
}
