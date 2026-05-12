package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockGroupRepository struct {
	mock.Mock
}

func (m *MockGroupRepository) CreateGroup(ctx context.Context, g *entities.Group) error {
	args := m.Called(ctx, g)
	return args.Error(0)
}

func (m *MockGroupRepository) GetGroupByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Group, error) {
	args := m.Called(ctx, id, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.Group), args.Error(1)
}

func (m *MockGroupRepository) ListGroupsByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]entities.Group, error) {
	args := m.Called(ctx, courseID, orgID)
	return args.Get(0).([]entities.Group), args.Error(1)
}

func (m *MockGroupRepository) UpdateGroup(ctx context.Context, g *entities.Group) error {
	args := m.Called(ctx, g)
	return args.Error(0)
}

func (m *MockGroupRepository) DeleteGroup(ctx context.Context, id, orgID uuid.UUID) error {
	args := m.Called(ctx, id, orgID)
	return args.Error(0)
}

func (m *MockGroupRepository) AddSchedule(ctx context.Context, s *entities.GroupSchedule) error {
	args := m.Called(ctx, s)
	return args.Error(0)
}

func (m *MockGroupRepository) ListSchedulesByGroup(ctx context.Context, groupID uuid.UUID) ([]entities.GroupSchedule, error) {
	args := m.Called(ctx, groupID)
	return args.Get(0).([]entities.GroupSchedule), args.Error(1)
}

func (m *MockGroupRepository) DeleteSchedule(ctx context.Context, id, groupID uuid.UUID) error {
	args := m.Called(ctx, id, groupID)
	return args.Error(0)
}

func (m *MockGroupRepository) AddMember(ctx context.Context, member *entities.GroupMember) error {
	args := m.Called(ctx, member)
	return args.Error(0)
}

func (m *MockGroupRepository) RemoveMember(ctx context.Context, groupID, studentID uuid.UUID) error {
	args := m.Called(ctx, groupID, studentID)
	return args.Error(0)
}

func (m *MockGroupRepository) ListMembers(ctx context.Context, groupID uuid.UUID) ([]entities.GroupMember, error) {
	args := m.Called(ctx, groupID)
	return args.Get(0).([]entities.GroupMember), args.Error(1)
}

func (m *MockGroupRepository) GetStudentGroup(ctx context.Context, courseID, studentID, orgID uuid.UUID) (*entities.Group, error) {
	args := m.Called(ctx, courseID, studentID, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.Group), args.Error(1)
}

func (m *MockGroupRepository) FindCourseIDsByStudent(ctx context.Context, studentID, orgID uuid.UUID) ([]uuid.UUID, error) {
	args := m.Called(ctx, studentID, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]uuid.UUID), args.Error(1)
}

func (m *MockGroupRepository) ListGroupsByOrg(ctx context.Context, orgID uuid.UUID) ([]entities.Group, error) {
	args := m.Called(ctx, orgID)
	return args.Get(0).([]entities.Group), args.Error(1)
}

func (m *MockGroupRepository) AssignToCourse(ctx context.Context, groupID, courseID, orgID uuid.UUID) error {
	args := m.Called(ctx, groupID, courseID, orgID)
	return args.Error(0)
}

func (m *MockGroupRepository) UnassignFromCourse(ctx context.Context, groupID, orgID uuid.UUID) error {
	args := m.Called(ctx, groupID, orgID)
	return args.Error(0)
}
