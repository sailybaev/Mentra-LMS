package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockAnnouncementRepository struct {
	mock.Mock
}

func (m *MockAnnouncementRepository) Create(ctx context.Context, a *entities.Announcement) error {
	args := m.Called(ctx, a)
	return args.Error(0)
}

func (m *MockAnnouncementRepository) GetByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Announcement, error) {
	args := m.Called(ctx, id, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.Announcement), args.Error(1)
}

func (m *MockAnnouncementRepository) ListByCourse(ctx context.Context, orgID, courseID uuid.UUID, limit, offset int) ([]entities.Announcement, int64, error) {
	args := m.Called(ctx, orgID, courseID, limit, offset)
	return args.Get(0).([]entities.Announcement), args.Get(1).(int64), args.Error(2)
}

func (m *MockAnnouncementRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	args := m.Called(ctx, id, orgID)
	return args.Error(0)
}
