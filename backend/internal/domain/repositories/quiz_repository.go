package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type QuizRepository interface {
	Create(ctx context.Context, quiz *entities.Quiz) error
	FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Quiz, error)
	FindByLesson(ctx context.Context, lessonID, orgID uuid.UUID) (*entities.Quiz, error)
	Update(ctx context.Context, quiz *entities.Quiz) error
	Delete(ctx context.Context, id, orgID uuid.UUID) error
}
