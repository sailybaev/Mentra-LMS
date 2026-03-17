package entities

import (
	"time"

	"github.com/google/uuid"
)

type LessonProgress struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	LessonID    uuid.UUID
	OrgID       uuid.UUID
	CompletedAt *time.Time
	Score       *float64
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
