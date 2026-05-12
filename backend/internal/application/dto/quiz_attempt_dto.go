package dto

import "time"

type QuizAnswerInput struct {
	QuestionID string `json:"question_id" binding:"required"`
	AnswerID   string `json:"answer_id" binding:"required"`
}

type SubmitQuizAttemptRequest struct {
	Answers []QuizAnswerInput `json:"answers" binding:"required"`
}

type QuizAttemptResultDTO struct {
	ID          string    `json:"id"`
	QuizID      string    `json:"quiz_id"`
	Score       int       `json:"score"`
	MaxScore    int       `json:"max_score"`
	Percentage  float64   `json:"percentage"`
	SubmittedAt time.Time `json:"submitted_at"`
}

type RemediationDTO struct {
	QuizID      string   `json:"quiz_id"`
	LessonTitle string   `json:"lesson_title"`
	Score       int      `json:"score"`
	MaxScore    int      `json:"max_score"`
	Percentage  float64  `json:"percentage"`
	Remediation string   `json:"remediation"`
	WeakTopics  []string `json:"weak_topics"`
}
