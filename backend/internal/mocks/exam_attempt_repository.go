package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockExamAttemptRepository struct {
	mock.Mock
}

func (m *MockExamAttemptRepository) Create(ctx context.Context, attempt *entities.ExamAttempt) error {
	args := m.Called(ctx, attempt)
	return args.Error(0)
}

func (m *MockExamAttemptRepository) FindByID(ctx context.Context, id uuid.UUID) (*entities.ExamAttempt, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.ExamAttempt), args.Error(1)
}

func (m *MockExamAttemptRepository) FindByExamAndStudent(ctx context.Context, examID, studentID uuid.UUID) ([]*entities.ExamAttempt, error) {
	args := m.Called(ctx, examID, studentID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entities.ExamAttempt), args.Error(1)
}

func (m *MockExamAttemptRepository) FindByExam(ctx context.Context, examID uuid.UUID) ([]*entities.ExamAttempt, error) {
	args := m.Called(ctx, examID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entities.ExamAttempt), args.Error(1)
}

func (m *MockExamAttemptRepository) FindActiveAttempt(ctx context.Context, examID, studentID uuid.UUID) (*entities.ExamAttempt, error) {
	args := m.Called(ctx, examID, studentID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.ExamAttempt), args.Error(1)
}

func (m *MockExamAttemptRepository) Update(ctx context.Context, attempt *entities.ExamAttempt) error {
	args := m.Called(ctx, attempt)
	return args.Error(0)
}

func (m *MockExamAttemptRepository) CountByExamAndStudent(ctx context.Context, examID, studentID uuid.UUID) (int, error) {
	args := m.Called(ctx, examID, studentID)
	return args.Int(0), args.Error(1)
}
