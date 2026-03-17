import { apiClient } from './client'
import { EnrollmentDTO, CreateEnrollmentInput } from '@/types/enrollment'

// Enrollment endpoints not yet implemented — all functions degrade gracefully on 404
export async function listEnrollments(courseId: string): Promise<EnrollmentDTO[]> {
  try {
    const res = await apiClient.get<EnrollmentDTO[]>(`/courses/${courseId}/enrollments`)
    return res.data
  } catch (err: unknown) {
    const e = err as { response?: { status?: number } }
    if (e?.response?.status === 404) return []
    throw err
  }
}

export async function createEnrollment(courseId: string, input: CreateEnrollmentInput): Promise<EnrollmentDTO> {
  const res = await apiClient.post<EnrollmentDTO>(`/courses/${courseId}/enrollments`, input)
  return res.data
}

export async function deleteEnrollment(courseId: string, enrollmentId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/enrollments/${enrollmentId}`)
}
