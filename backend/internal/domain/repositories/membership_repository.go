package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type MembershipRepository interface {
	Create(ctx context.Context, m *entities.Membership) error
	FindByUserAndOrg(ctx context.Context, userID, orgID uuid.UUID) (*entities.Membership, error)
	FindByOrg(ctx context.Context, orgID uuid.UUID, page, pageSize int) ([]entities.Membership, int64, error)
	FindByOrgFiltered(ctx context.Context, orgID uuid.UUID, role string, page, pageSize int) ([]entities.Membership, int64, error)
	FindUserRole(ctx context.Context, userID, orgID uuid.UUID) (entities.Role, error)
	FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Membership, error)
	Update(ctx context.Context, m *entities.Membership) error
	Delete(ctx context.Context, id, orgID uuid.UUID) error
}
