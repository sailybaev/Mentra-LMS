// Forward-declared — enrollment endpoints not yet implemented in backend
export interface EnrollmentDTO {
  id: string
  course_id: string
  user_id: string
  enrolled_at: string
  status: 'active' | 'completed' | 'dropped'
}

export interface CreateEnrollmentInput {
  user_id: string
  course_id: string
}
