export interface QuizAnswer {
  id: string
  answer: string
  is_correct: boolean
}

export interface QuizQuestion {
  id: string
  question: string
  answers: QuizAnswer[]
  explanation?: string
}

export interface QuizDTO {
  lesson_id: string
  questions: QuizQuestion[]
  max_points?: number
  due_date?: string | null
  allow_late_submission?: boolean
}

export interface GenerateQuizInput {
  lesson_id: string
  num_questions: number
}

export interface QuizSubmission {
  question_id: string
  answer_id: string
}

export interface QuizResult {
  score: number
  total: number
  percentage: number
  answers: {
    question_id: string
    correct: boolean
    correct_answer_id: string
  }[]
}
