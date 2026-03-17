package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/stretchr/testify/mock"
)

type MockAIService struct {
	mock.Mock
}

func (m *MockAIService) GenerateLessonSummary(ctx context.Context, lessonContent string) (string, error) {
	args := m.Called(ctx, lessonContent)
	return args.String(0), args.Error(1)
}

func (m *MockAIService) GenerateQuiz(ctx context.Context, lessonContent string, numQuestions int) ([]entities.QuizQuestion, error) {
	args := m.Called(ctx, lessonContent, numQuestions)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]entities.QuizQuestion), args.Error(1)
}

func (m *MockAIService) GenerateProgressInsights(ctx context.Context, completedLessons []entities.LessonProgress) (string, error) {
	args := m.Called(ctx, completedLessons)
	return args.String(0), args.Error(1)
}
