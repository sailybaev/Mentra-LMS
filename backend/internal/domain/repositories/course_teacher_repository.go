package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type CourseTeacherRepository interface {
	Add(ctx context.Context, ct *entities.CourseTeacher) error
	Remove(ctx context.Context, courseID, teacherID, orgID uuid.UUID) error
	ListByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]entities.CourseTeacher, error)
	ListByTeacher(ctx context.Context, teacherID, orgID uuid.UUID) ([]entities.CourseTeacher, error)
	Exists(ctx context.Context, courseID, teacherID, orgID uuid.UUID) (bool, error)
	FindCourseIDsByTeacher(ctx context.Context, teacherID, orgID uuid.UUID) ([]uuid.UUID, error)
}
