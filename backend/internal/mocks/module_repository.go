package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockModuleRepository struct {
	mock.Mock
}

func (m *MockModuleRepository) Create(ctx context.Context, module *entities.Module) error {
	args := m.Called(ctx, module)
	return args.Error(0)
}

func (m *MockModuleRepository) FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Module, error) {
	args := m.Called(ctx, id, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.Module), args.Error(1)
}

func (m *MockModuleRepository) FindByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]entities.Module, error) {
	args := m.Called(ctx, courseID, orgID)
	return args.Get(0).([]entities.Module), args.Error(1)
}

func (m *MockModuleRepository) Update(ctx context.Context, module *entities.Module) error {
	args := m.Called(ctx, module)
	return args.Error(0)
}

func (m *MockModuleRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	args := m.Called(ctx, id, orgID)
	return args.Error(0)
}

func (m *MockModuleRepository) UpdatePositions(ctx context.Context, modules []entities.Module, orgID uuid.UUID) error {
	args := m.Called(ctx, modules, orgID)
	return args.Error(0)
}
