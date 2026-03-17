package entities

import (
	"time"

	"github.com/google/uuid"
)

type Announcement struct {
	ID        uuid.UUID
	CourseID  uuid.UUID
	OrgID     uuid.UUID
	AuthorID  uuid.UUID
	Title     string
	Content   string
	CreatedAt time.Time
	UpdatedAt time.Time
}
