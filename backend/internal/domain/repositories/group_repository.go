package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type GroupRepository interface {
	CreateGroup(ctx context.Context, g *entities.Group) error
	GetGroupByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Group, error)
	ListGroupsByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]entities.Group, error)
	UpdateGroup(ctx context.Context, g *entities.Group) error
	DeleteGroup(ctx context.Context, id, orgID uuid.UUID) error

	AddSchedule(ctx context.Context, s *entities.GroupSchedule) error
	ListSchedulesByGroup(ctx context.Context, groupID uuid.UUID) ([]entities.GroupSchedule, error)
	DeleteSchedule(ctx context.Context, id, groupID uuid.UUID) error

	AddMember(ctx context.Context, m *entities.GroupMember) error
	RemoveMember(ctx context.Context, groupID, studentID uuid.UUID) error
	ListMembers(ctx context.Context, groupID uuid.UUID) ([]entities.GroupMember, error)
	GetStudentGroup(ctx context.Context, courseID, studentID, orgID uuid.UUID) (*entities.Group, error)
	FindCourseIDsByStudent(ctx context.Context, studentID, orgID uuid.UUID) ([]uuid.UUID, error)
}
