package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockQuizRepository struct {
	mock.Mock
}

func (m *MockQuizRepository) Create(ctx context.Context, quiz *entities.Quiz) error {
	args := m.Called(ctx, quiz)
	return args.Error(0)
}

func (m *MockQuizRepository) FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Quiz, error) {
	args := m.Called(ctx, id, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.Quiz), args.Error(1)
}

func (m *MockQuizRepository) FindByLesson(ctx context.Context, lessonID, orgID uuid.UUID) (*entities.Quiz, error) {
	args := m.Called(ctx, lessonID, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.Quiz), args.Error(1)
}

func (m *MockQuizRepository) Update(ctx context.Context, quiz *entities.Quiz) error {
	args := m.Called(ctx, quiz)
	return args.Error(0)
}

func (m *MockQuizRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	args := m.Called(ctx, id, orgID)
	return args.Error(0)
}
