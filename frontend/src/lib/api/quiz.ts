import { apiClient } from './client'

export interface TeacherQuizAnswer {
  id: string
  answer: string
  is_correct: boolean
}

export interface TeacherQuizQuestion {
  id: string
  question: string
  position: number
  answers: TeacherQuizAnswer[]
}

export interface TeacherQuizDTO {
  id: string
  lesson_id: string
  org_id: string
  title: string
  questions: TeacherQuizQuestion[]
  created_at: string
  updated_at: string
}

export interface CreateQuizInput {
  title: string
  questions: Array<{
    question: string
    position: number
    answers: Array<{ answer: string; is_correct: boolean }>
  }>
}

export interface UpdateQuizInput {
  title?: string
  questions: Array<{
    question: string
    position: number
    answers: Array<{ answer: string; is_correct: boolean }>
  }>
}

export async function getQuizByLesson(lessonId: string): Promise<TeacherQuizDTO> {
  const res = await apiClient.get<TeacherQuizDTO>(`/lessons/${lessonId}/quiz`)
  return res.data
}

export async function createQuiz(lessonId: string, data: CreateQuizInput): Promise<TeacherQuizDTO> {
  const res = await apiClient.post<TeacherQuizDTO>(`/lessons/${lessonId}/quiz`, data)
  return res.data
}

export async function updateQuiz(quizId: string, data: UpdateQuizInput): Promise<TeacherQuizDTO> {
  const res = await apiClient.put<TeacherQuizDTO>(`/quizzes/${quizId}`, data)
  return res.data
}
