export interface ProgressDTO {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  completed: boolean
  score?: number
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface InsightsDTO {
  insights: string
  generated_at: string
  course_id: string
}

export interface CourseProgressSummary {
  course_id: string
  total_lessons: number
  completed_lessons: number
  percentage: number
  average_score?: number
}
