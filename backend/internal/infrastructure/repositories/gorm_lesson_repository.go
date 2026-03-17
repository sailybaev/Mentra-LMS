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

type GORMLessonRepository struct {
	db *gorm.DB
}

func NewGORMLessonRepository(db *gorm.DB) *GORMLessonRepository {
	return &GORMLessonRepository{db: db}
}

func (r *GORMLessonRepository) Create(ctx context.Context, lesson *entities.Lesson) error {
	return r.db.WithContext(ctx).Create(toLessonModel(lesson)).Error
}

func (r *GORMLessonRepository) FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Lesson, error) {
	var model database.LessonModel
	err := r.db.WithContext(ctx).First(&model, "id = ? AND org_id = ?", id.String(), orgID.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("lesson", id.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toLessonEntity(&model), nil
}

func (r *GORMLessonRepository) FindByModule(ctx context.Context, moduleID, orgID uuid.UUID) ([]entities.Lesson, error) {
	var models []database.LessonModel
	err := r.db.WithContext(ctx).
		Where("module_id = ? AND org_id = ?", moduleID.String(), orgID.String()).
		Order("position ASC").Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]entities.Lesson, len(models))
	for i, m := range models {
		result[i] = *toLessonEntity(&m)
	}
	return result, nil
}

func (r *GORMLessonRepository) Update(ctx context.Context, lesson *entities.Lesson) error {
	lesson.UpdatedAt = time.Now()
	return r.db.WithContext(ctx).Save(toLessonModel(lesson)).Error
}

func (r *GORMLessonRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	result := r.db.WithContext(ctx).Where("id = ? AND org_id = ?", id.String(), orgID.String()).Delete(&database.LessonModel{})
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("lesson", id.String())
	}
	return nil
}

func (r *GORMLessonRepository) UpdatePositions(ctx context.Context, lessons []entities.Lesson, orgID uuid.UUID) error {
	for _, l := range lessons {
		if err := r.db.WithContext(ctx).Model(&database.LessonModel{}).
			Where("id = ? AND org_id = ?", l.ID.String(), orgID.String()).
			Update("position", l.Position).Error; err != nil {
			return apperrors.InternalError(err.Error())
		}
	}
	return nil
}

func toLessonModel(l *entities.Lesson) *database.LessonModel {
	return &database.LessonModel{
		ID:        l.ID.String(),
		ModuleID:  l.ModuleID.String(),
		OrgID:     l.OrgID.String(),
		Title:     l.Title,
		Content:   l.Content,
		Type:      string(l.Type),
		VideoURL:  l.VideoURL,
		LinkURL:   l.LinkURL,
		FileURL:   l.FileURL,
		Position:  l.Position,
		CreatedAt: l.CreatedAt,
		UpdatedAt: l.UpdatedAt,
	}
}

func toLessonEntity(m *database.LessonModel) *entities.Lesson {
	id, _ := uuid.Parse(m.ID)
	moduleID, _ := uuid.Parse(m.ModuleID)
	orgID, _ := uuid.Parse(m.OrgID)
	return &entities.Lesson{
		ID:        id,
		ModuleID:  moduleID,
		OrgID:     orgID,
		Title:     m.Title,
		Content:   m.Content,
		Type:      entities.LessonType(m.Type),
		VideoURL:  m.VideoURL,
		LinkURL:   m.LinkURL,
		FileURL:   m.FileURL,
		Position:  m.Position,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}
