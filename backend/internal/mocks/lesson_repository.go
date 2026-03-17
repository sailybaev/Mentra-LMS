package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockLessonRepository struct {
	mock.Mock
}

func (m *MockLessonRepository) Create(ctx context.Context, lesson *entities.Lesson) error {
	args := m.Called(ctx, lesson)
	return args.Error(0)
}

func (m *MockLessonRepository) FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Lesson, error) {
	args := m.Called(ctx, id, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.Lesson), args.Error(1)
}

func (m *MockLessonRepository) FindByModule(ctx context.Context, moduleID, orgID uuid.UUID) ([]entities.Lesson, error) {
	args := m.Called(ctx, moduleID, orgID)
	return args.Get(0).([]entities.Lesson), args.Error(1)
}

func (m *MockLessonRepository) Update(ctx context.Context, lesson *entities.Lesson) error {
	args := m.Called(ctx, lesson)
	return args.Error(0)
}

func (m *MockLessonRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	args := m.Called(ctx, id, orgID)
	return args.Error(0)
}

func (m *MockLessonRepository) UpdatePositions(ctx context.Context, lessons []entities.Lesson, orgID uuid.UUID) error {
	args := m.Called(ctx, lessons, orgID)
	return args.Error(0)
}
