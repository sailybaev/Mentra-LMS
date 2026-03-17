package entities

import (
	"time"

	"github.com/google/uuid"
)

type ExamMCQAnswer struct {
	QuestionID string `json:"question_id"`
	AnswerID   string `json:"answer_id"`
}

type ExamAttempt struct {
	ID          uuid.UUID
	ExamID      uuid.UUID
	StudentID   uuid.UUID
	OrgID       uuid.UUID
	Status      string // "in_progress" | "submitted" | "expired"
	StartedAt   time.Time
	ExpiresAt   time.Time
	SubmittedAt *time.Time
	MCQAnswers  []ExamMCQAnswer
	MCQScore    *int
	MCQMaxScore int
	FilePath    string
	FileScore   *int
	FilePoints  int
	FileFeedback string
	TotalScore  *int
	GradedBy    *uuid.UUID
	GradedAt    *time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type ExtraAttemptGrant struct {
	ID         uuid.UUID
	ExamID     uuid.UUID
	StudentID  uuid.UUID
	OrgID      uuid.UUID
	GrantedBy  uuid.UUID
	ExtraCount int
	CreatedAt  time.Time
}
