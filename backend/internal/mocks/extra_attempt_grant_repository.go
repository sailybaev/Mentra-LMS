package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockExtraAttemptGrantRepository struct {
	mock.Mock
}

func (m *MockExtraAttemptGrantRepository) Create(ctx context.Context, grant *entities.ExtraAttemptGrant) error {
	args := m.Called(ctx, grant)
	return args.Error(0)
}

func (m *MockExtraAttemptGrantRepository) SumByExamAndStudent(ctx context.Context, examID, studentID uuid.UUID) (int, error) {
	args := m.Called(ctx, examID, studentID)
	return args.Int(0), args.Error(1)
}
