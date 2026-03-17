package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type UserRepository interface {
	Create(ctx context.Context, user *entities.User) error
	FindByID(ctx context.Context, id uuid.UUID) (*entities.User, error)
	FindByEmail(ctx context.Context, email string) (*entities.User, error)
	Update(ctx context.Context, user *entities.User) error
	ListAll(ctx context.Context, page, pageSize int) ([]entities.User, int64, error)
	FindByIDs(ctx context.Context, ids []uuid.UUID) ([]entities.User, error)
}
