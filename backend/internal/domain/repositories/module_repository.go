package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type ModuleRepository interface {
	Create(ctx context.Context, module *entities.Module) error
	FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Module, error)
	FindByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]entities.Module, error)
	Update(ctx context.Context, module *entities.Module) error
	Delete(ctx context.Context, id, orgID uuid.UUID) error
	UpdatePositions(ctx context.Context, modules []entities.Module, orgID uuid.UUID) error
}
