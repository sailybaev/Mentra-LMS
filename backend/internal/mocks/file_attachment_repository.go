package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockFileAttachmentRepository struct {
	mock.Mock
}

func (m *MockFileAttachmentRepository) Create(ctx context.Context, f *entities.FileAttachment) error {
	args := m.Called(ctx, f)
	return args.Error(0)
}

func (m *MockFileAttachmentRepository) FindByRef(ctx context.Context, refType string, refID uuid.UUID) ([]*entities.FileAttachment, error) {
	args := m.Called(ctx, refType, refID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entities.FileAttachment), args.Error(1)
}

func (m *MockFileAttachmentRepository) FindByID(ctx context.Context, id uuid.UUID) (*entities.FileAttachment, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.FileAttachment), args.Error(1)
}

func (m *MockFileAttachmentRepository) Delete(ctx context.Context, id uuid.UUID) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}
