package entities

import (
	"time"

	"github.com/google/uuid"
)

type QuizAttemptAnswer struct {
	QuestionID string `json:"question_id"`
	AnswerID   string `json:"answer_id"`
}

type QuizAttempt struct {
	ID          uuid.UUID
	QuizID      uuid.UUID
	StudentID   uuid.UUID
	OrgID       uuid.UUID
	Score       int
	MaxScore    int
	Answers     []QuizAttemptAnswer
	SubmittedAt time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
