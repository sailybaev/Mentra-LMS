package entities

import (
	"time"

	"github.com/google/uuid"
)

type CourseTeacher struct {
	ID         uuid.UUID
	CourseID   uuid.UUID
	TeacherID  uuid.UUID
	OrgID      uuid.UUID
	AssignedAt time.Time
}
