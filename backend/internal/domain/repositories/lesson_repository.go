package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type LessonRepository interface {
	Create(ctx context.Context, lesson *entities.Lesson) error
	FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Lesson, error)
	FindByModule(ctx context.Context, moduleID, orgID uuid.UUID) ([]entities.Lesson, error)
	Update(ctx context.Context, lesson *entities.Lesson) error
	Delete(ctx context.Context, id, orgID uuid.UUID) error
	UpdatePositions(ctx context.Context, lessons []entities.Lesson, orgID uuid.UUID) error
}
