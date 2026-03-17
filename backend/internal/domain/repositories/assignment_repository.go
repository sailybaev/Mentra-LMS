package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type AssignmentRepository interface {
	Create(ctx context.Context, a *entities.Assignment) error
	FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Assignment, error)
	FindByModule(ctx context.Context, moduleID, orgID uuid.UUID) ([]*entities.Assignment, error)
	FindByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]*entities.Assignment, error)
	Update(ctx context.Context, a *entities.Assignment) error
	Delete(ctx context.Context, id, orgID uuid.UUID) error
	CreateSubmission(ctx context.Context, s *entities.AssignmentSubmission) error
	FindSubmission(ctx context.Context, assignmentID, studentID uuid.UUID) (*entities.AssignmentSubmission, error)
	FindSubmissionByID(ctx context.Context, id uuid.UUID) (*entities.AssignmentSubmission, error)
	FindSubmissionsByAssignment(ctx context.Context, assignmentID uuid.UUID) ([]*entities.AssignmentSubmission, error)
	UpdateSubmission(ctx context.Context, s *entities.AssignmentSubmission) error
	DeleteSubmission(ctx context.Context, id, studentID uuid.UUID) error
}
