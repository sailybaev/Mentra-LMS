package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type AnnouncementRepository interface {
	Create(ctx context.Context, a *entities.Announcement) error
	GetByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Announcement, error)
	ListByCourse(ctx context.Context, orgID, courseID uuid.UUID, limit, offset int) ([]entities.Announcement, int64, error)
	Delete(ctx context.Context, id, orgID uuid.UUID) error
}
