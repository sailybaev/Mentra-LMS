package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockAssignmentRepository struct {
	mock.Mock
}

func (m *MockAssignmentRepository) Create(ctx context.Context, a *entities.Assignment) error {
	args := m.Called(ctx, a)
	return args.Error(0)
}

func (m *MockAssignmentRepository) FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Assignment, error) {
	args := m.Called(ctx, id, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.Assignment), args.Error(1)
}

func (m *MockAssignmentRepository) FindByModule(ctx context.Context, moduleID, orgID uuid.UUID) ([]*entities.Assignment, error) {
	args := m.Called(ctx, moduleID, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entities.Assignment), args.Error(1)
}

func (m *MockAssignmentRepository) FindByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]*entities.Assignment, error) {
	args := m.Called(ctx, courseID, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entities.Assignment), args.Error(1)
}

func (m *MockAssignmentRepository) Update(ctx context.Context, a *entities.Assignment) error {
	args := m.Called(ctx, a)
	return args.Error(0)
}

func (m *MockAssignmentRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	args := m.Called(ctx, id, orgID)
	return args.Error(0)
}

func (m *MockAssignmentRepository) CreateSubmission(ctx context.Context, s *entities.AssignmentSubmission) error {
	args := m.Called(ctx, s)
	return args.Error(0)
}

func (m *MockAssignmentRepository) FindSubmission(ctx context.Context, assignmentID, studentID uuid.UUID) (*entities.AssignmentSubmission, error) {
	args := m.Called(ctx, assignmentID, studentID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.AssignmentSubmission), args.Error(1)
}

func (m *MockAssignmentRepository) FindSubmissionByID(ctx context.Context, id uuid.UUID) (*entities.AssignmentSubmission, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.AssignmentSubmission), args.Error(1)
}

func (m *MockAssignmentRepository) FindSubmissionsByAssignment(ctx context.Context, assignmentID uuid.UUID) ([]*entities.AssignmentSubmission, error) {
	args := m.Called(ctx, assignmentID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entities.AssignmentSubmission), args.Error(1)
}

func (m *MockAssignmentRepository) UpdateSubmission(ctx context.Context, s *entities.AssignmentSubmission) error {
	args := m.Called(ctx, s)
	return args.Error(0)
}
