package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockMembershipRepository struct {
	mock.Mock
}

func (m *MockMembershipRepository) Create(ctx context.Context, membership *entities.Membership) error {
	args := m.Called(ctx, membership)
	return args.Error(0)
}

func (m *MockMembershipRepository) FindByUserAndOrg(ctx context.Context, userID, orgID uuid.UUID) (*entities.Membership, error) {
	args := m.Called(ctx, userID, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.Membership), args.Error(1)
}

func (m *MockMembershipRepository) FindByOrg(ctx context.Context, orgID uuid.UUID, page, pageSize int) ([]entities.Membership, int64, error) {
	args := m.Called(ctx, orgID, page, pageSize)
	return args.Get(0).([]entities.Membership), args.Get(1).(int64), args.Error(2)
}

func (m *MockMembershipRepository) FindUserRole(ctx context.Context, userID, orgID uuid.UUID) (entities.Role, error) {
	args := m.Called(ctx, userID, orgID)
	return args.Get(0).(entities.Role), args.Error(1)
}

func (m *MockMembershipRepository) FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Membership, error) {
	args := m.Called(ctx, id, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entities.Membership), args.Error(1)
}

func (m *MockMembershipRepository) FindByOrgFiltered(ctx context.Context, orgID uuid.UUID, role string, page, pageSize int) ([]entities.Membership, int64, error) {
	args := m.Called(ctx, orgID, role, page, pageSize)
	return args.Get(0).([]entities.Membership), args.Get(1).(int64), args.Error(2)
}

func (m *MockMembershipRepository) Update(ctx context.Context, membership *entities.Membership) error {
	args := m.Called(ctx, membership)
	return args.Error(0)
}

func (m *MockMembershipRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	args := m.Called(ctx, id, orgID)
	return args.Error(0)
}
