package entities

import (
	"time"

	"github.com/google/uuid"
)

type Module struct {
	ID        uuid.UUID
	CourseID  uuid.UUID
	OrgID     uuid.UUID
	Title     string
	Position  int
	CreatedAt time.Time
	UpdatedAt time.Time
}
