package entities

import (
	"time"

	"github.com/google/uuid"
)

type Quiz struct {
	ID                  uuid.UUID
	LessonID            uuid.UUID
	OrgID               uuid.UUID
	Title               string
	MaxPoints           int
	DueDate             *time.Time
	AllowLateSubmission bool
	Questions           []QuizQuestion
	CreatedAt           time.Time
	UpdatedAt           time.Time
}

type QuizQuestion struct {
	ID        uuid.UUID
	QuizID    uuid.UUID
	Question  string
	Position  int
	Answers   []QuizAnswer
	CreatedAt time.Time
	UpdatedAt time.Time
}

type QuizAnswer struct {
	ID         uuid.UUID
	QuestionID uuid.UUID
	Answer     string
	IsCorrect  bool
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
