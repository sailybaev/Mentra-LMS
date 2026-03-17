package repositories

import (
	"context"
	"time"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/infrastructure/database"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GORMModuleRepository struct {
	db *gorm.DB
}

func NewGORMModuleRepository(db *gorm.DB) *GORMModuleRepository {
	return &GORMModuleRepository{db: db}
}

func (r *GORMModuleRepository) Create(ctx context.Context, module *entities.Module) error {
	return r.db.WithContext(ctx).Create(toModuleModel(module)).Error
}

func (r *GORMModuleRepository) FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Module, error) {
	var model database.ModuleModel
	err := r.db.WithContext(ctx).First(&model, "id = ? AND org_id = ?", id.String(), orgID.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("module", id.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toModuleEntity(&model), nil
}

func (r *GORMModuleRepository) FindByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]entities.Module, error) {
	var models []database.ModuleModel
	err := r.db.WithContext(ctx).
		Where("course_id = ? AND org_id = ?", courseID.String(), orgID.String()).
		Order("position ASC").Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]entities.Module, len(models))
	for i, m := range models {
		result[i] = *toModuleEntity(&m)
	}
	return result, nil
}

func (r *GORMModuleRepository) Update(ctx context.Context, module *entities.Module) error {
	module.UpdatedAt = time.Now()
	return r.db.WithContext(ctx).Save(toModuleModel(module)).Error
}

func (r *GORMModuleRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	result := r.db.WithContext(ctx).Where("id = ? AND org_id = ?", id.String(), orgID.String()).Delete(&database.ModuleModel{})
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("module", id.String())
	}
	return nil
}

func (r *GORMModuleRepository) UpdatePositions(ctx context.Context, modules []entities.Module, orgID uuid.UUID) error {
	for _, m := range modules {
		if err := r.db.WithContext(ctx).Model(&database.ModuleModel{}).
			Where("id = ? AND org_id = ?", m.ID.String(), orgID.String()).
			Update("position", m.Position).Error; err != nil {
			return apperrors.InternalError(err.Error())
		}
	}
	return nil
}

func toModuleModel(m *entities.Module) *database.ModuleModel {
	return &database.ModuleModel{
		ID:        m.ID.String(),
		CourseID:  m.CourseID.String(),
		OrgID:     m.OrgID.String(),
		Title:     m.Title,
		Position:  m.Position,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}

func toModuleEntity(m *database.ModuleModel) *entities.Module {
	id, _ := uuid.Parse(m.ID)
	courseID, _ := uuid.Parse(m.CourseID)
	orgID, _ := uuid.Parse(m.OrgID)
	return &entities.Module{
		ID:        id,
		CourseID:  courseID,
		OrgID:     orgID,
		Title:     m.Title,
		Position:  m.Position,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}
