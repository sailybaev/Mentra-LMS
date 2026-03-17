package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type FileAttachmentRepository interface {
	Create(ctx context.Context, f *entities.FileAttachment) error
	FindByRef(ctx context.Context, refType string, refID uuid.UUID) ([]*entities.FileAttachment, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entities.FileAttachment, error)
	Delete(ctx context.Context, id uuid.UUID) error
}
