package entities

import (
	"time"

	"github.com/google/uuid"
)

type Group struct {
	ID        uuid.UUID
	CourseID  *uuid.UUID
	OrgID     uuid.UUID
	TeacherID *uuid.UUID
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type GroupSchedule struct {
	ID        uuid.UUID
	GroupID   uuid.UUID
	DayOfWeek int
	StartTime string
	EndTime   string
	Location  string
	CreatedAt time.Time
}

type GroupMember struct {
	ID        uuid.UUID
	GroupID   uuid.UUID
	StudentID uuid.UUID
	OrgID     uuid.UUID
	JoinedAt  time.Time
}
