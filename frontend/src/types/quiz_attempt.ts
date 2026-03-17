export interface QuizAttemptResultDTO {
  id: string;
  quiz_id: string;
  score: number;
  max_score: number;
  percentage: number;
  submitted_at: string;
}

export interface QuizAnswerInput {
  question_id: string;
  answer_id: string;
}
