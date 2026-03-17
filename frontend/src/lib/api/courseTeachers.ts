import { apiClient } from './client'
import { CourseTeacherDTO, AssignTeacherInput } from '@/types/course_teacher'

export async function listCourseTeachers(courseId: string): Promise<CourseTeacherDTO[]> {
  const res = await apiClient.get<CourseTeacherDTO[]>(`/courses/${courseId}/teachers`)
  return res.data ?? []
}

export async function assignTeacher(courseId: string, input: AssignTeacherInput): Promise<CourseTeacherDTO> {
  const res = await apiClient.post<CourseTeacherDTO>(`/courses/${courseId}/teachers`, input)
  return res.data
}

export async function removeTeacher(courseId: string, teacherId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/teachers/${teacherId}`)
}
