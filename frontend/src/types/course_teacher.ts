export interface CourseTeacherDTO {
  id: string
  course_id: string
  teacher_id: string
  org_id: string
  assigned_at: string
}

export interface AssignTeacherInput {
  teacher_id: string
}
