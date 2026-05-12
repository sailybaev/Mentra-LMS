package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockQuizAttemptRepository struct {
	mock.Mock
}

func (m *MockQuizAttemptRepository) Create(ctx context.Context, a *entities.QuizAttempt) error {
	args := m.Called(ctx, a)
	return args.Error(0)
}

func (m *MockQuizAttemptRepository) FindByQuizAndStudent(ctx context.Context, quizID, studentID uuid.UUID) (*entities.QuizAttempt, error) {
	args := m.Called(ctx, quizID, studentID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.QuizAttempt), args.Error(1)
}

func (m *MockQuizAttemptRepository) FindByQuiz(ctx context.Context, quizID uuid.UUID) ([]*entities.QuizAttempt, error) {
	args := m.Called(ctx, quizID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entities.QuizAttempt), args.Error(1)
}

func (m *MockQuizAttemptRepository) FindByStudentAndQuizzes(ctx context.Context, studentID uuid.UUID, quizIDs []uuid.UUID) ([]*entities.QuizAttempt, error) {
	args := m.Called(ctx, studentID, quizIDs)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entities.QuizAttempt), args.Error(1)
}
