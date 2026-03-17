package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/infrastructure/database"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GORMMembershipRepository struct {
	db *gorm.DB
}

func NewGORMMembershipRepository(db *gorm.DB) *GORMMembershipRepository {
	return &GORMMembershipRepository{db: db}
}

func (r *GORMMembershipRepository) Create(ctx context.Context, m *entities.Membership) error {
	model := &database.MembershipModel{
		ID:        m.ID.String(),
		UserID:    m.UserID.String(),
		OrgID:     m.OrgID.String(),
		Role:      string(m.Role),
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
	return r.db.WithContext(ctx).Create(model).Error
}

func (r *GORMMembershipRepository) FindByUserAndOrg(ctx context.Context, userID, orgID uuid.UUID) (*entities.Membership, error) {
	var model database.MembershipModel
	err := r.db.WithContext(ctx).First(&model, "user_id = ? AND org_id = ?", userID.String(), orgID.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("membership", userID.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toMembershipEntity(&model), nil
}

func (r *GORMMembershipRepository) FindByOrg(ctx context.Context, orgID uuid.UUID, page, pageSize int) ([]entities.Membership, int64, error) {
	var models []database.MembershipModel
	var count int64
	err := r.db.WithContext(ctx).Model(&database.MembershipModel{}).Where("org_id = ?", orgID.String()).Count(&count).Error
	if err != nil {
		return nil, 0, apperrors.InternalError(err.Error())
	}
	err = r.db.WithContext(ctx).Where("org_id = ?", orgID.String()).
		Offset((page-1)*pageSize).Limit(pageSize).Find(&models).Error
	if err != nil {
		return nil, 0, apperrors.InternalError(err.Error())
	}
	result := make([]entities.Membership, len(models))
	for i, m := range models {
		result[i] = *toMembershipEntity(&m)
	}
	return result, count, nil
}

func (r *GORMMembershipRepository) FindByOrgFiltered(ctx context.Context, orgID uuid.UUID, role string, page, pageSize int) ([]entities.Membership, int64, error) {
	var models []database.MembershipModel
	var count int64
	q := r.db.WithContext(ctx).Model(&database.MembershipModel{}).Where("org_id = ?", orgID.String())
	if role != "" {
		q = q.Where("role = ?", role)
	}
	if err := q.Count(&count).Error; err != nil {
		return nil, 0, apperrors.InternalError(err.Error())
	}
	q2 := r.db.WithContext(ctx).Where("org_id = ?", orgID.String())
	if role != "" {
		q2 = q2.Where("role = ?", role)
	}
	if err := q2.Offset((page-1)*pageSize).Limit(pageSize).Find(&models).Error; err != nil {
		return nil, 0, apperrors.InternalError(err.Error())
	}
	result := make([]entities.Membership, len(models))
	for i, m := range models {
		result[i] = *toMembershipEntity(&m)
	}
	return result, count, nil
}

func (r *GORMMembershipRepository) FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Membership, error) {
	var model database.MembershipModel
	err := r.db.WithContext(ctx).First(&model, "id = ? AND org_id = ?", id.String(), orgID.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("membership", id.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toMembershipEntity(&model), nil
}

func (r *GORMMembershipRepository) Update(ctx context.Context, m *entities.Membership) error {
	model := &database.MembershipModel{
		ID:        m.ID.String(),
		UserID:    m.UserID.String(),
		OrgID:     m.OrgID.String(),
		Role:      string(m.Role),
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
	return r.db.WithContext(ctx).Save(model).Error
}

func (r *GORMMembershipRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	result := r.db.WithContext(ctx).Where("id = ? AND org_id = ?", id.String(), orgID.String()).Delete(&database.MembershipModel{})
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("membership", id.String())
	}
	return nil
}

func (r *GORMMembershipRepository) FindUserRole(ctx context.Context, userID, orgID uuid.UUID) (entities.Role, error) {
	var model database.MembershipModel
	err := r.db.WithContext(ctx).First(&model, "user_id = ? AND org_id = ?", userID.String(), orgID.String()).Error
	if err == gorm.ErrRecordNotFound {
		return "", apperrors.NotFoundError("membership", userID.String())
	}
	if err != nil {
		return "", apperrors.InternalError(err.Error())
	}
	return entities.Role(model.Role), nil
}

func toMembershipEntity(m *database.MembershipModel) *entities.Membership {
	id, _ := uuid.Parse(m.ID)
	userID, _ := uuid.Parse(m.UserID)
	orgID, _ := uuid.Parse(m.OrgID)
	return &entities.Membership{
		ID:        id,
		UserID:    userID,
		OrgID:     orgID,
		Role:      entities.Role(m.Role),
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}
