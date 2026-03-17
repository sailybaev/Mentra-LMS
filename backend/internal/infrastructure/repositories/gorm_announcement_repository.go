package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/infrastructure/database"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GORMAnnouncementRepository struct {
	db *gorm.DB
}

func NewGORMAnnouncementRepository(db *gorm.DB) *GORMAnnouncementRepository {
	return &GORMAnnouncementRepository{db: db}
}

func (r *GORMAnnouncementRepository) Create(ctx context.Context, a *entities.Announcement) error {
	return r.db.WithContext(ctx).Create(toAnnouncementModel(a)).Error
}

func (r *GORMAnnouncementRepository) GetByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Announcement, error) {
	var model database.AnnouncementModel
	err := r.db.WithContext(ctx).First(&model, "id = ? AND org_id = ?", id.String(), orgID.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("announcement", id.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toAnnouncementEntity(&model), nil
}

func (r *GORMAnnouncementRepository) ListByCourse(ctx context.Context, orgID, courseID uuid.UUID, limit, offset int) ([]entities.Announcement, int64, error) {
	var models []database.AnnouncementModel
	var count int64
	q := r.db.WithContext(ctx).Model(&database.AnnouncementModel{}).
		Where("org_id = ? AND course_id = ?", orgID.String(), courseID.String())
	if err := q.Count(&count).Error; err != nil {
		return nil, 0, apperrors.InternalError(err.Error())
	}
	if err := q.Order("created_at DESC").Limit(limit).Offset(offset).Find(&models).Error; err != nil {
		return nil, 0, apperrors.InternalError(err.Error())
	}
	result := make([]entities.Announcement, len(models))
	for i, m := range models {
		result[i] = *toAnnouncementEntity(&m)
	}
	return result, count, nil
}

func (r *GORMAnnouncementRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	result := r.db.WithContext(ctx).Where("id = ? AND org_id = ?", id.String(), orgID.String()).Delete(&database.AnnouncementModel{})
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("announcement", id.String())
	}
	return nil
}

func toAnnouncementModel(a *entities.Announcement) *database.AnnouncementModel {
	return &database.AnnouncementModel{
		ID:        a.ID.String(),
		CourseID:  a.CourseID.String(),
		OrgID:     a.OrgID.String(),
		AuthorID:  a.AuthorID.String(),
		Title:     a.Title,
		Content:   a.Content,
		CreatedAt: a.CreatedAt,
		UpdatedAt: a.UpdatedAt,
	}
}

func toAnnouncementEntity(m *database.AnnouncementModel) *entities.Announcement {
	id, _ := uuid.Parse(m.ID)
	courseID, _ := uuid.Parse(m.CourseID)
	orgID, _ := uuid.Parse(m.OrgID)
	authorID, _ := uuid.Parse(m.AuthorID)
	return &entities.Announcement{
		ID:        id,
		CourseID:  courseID,
		OrgID:     orgID,
		AuthorID:  authorID,
		Title:     m.Title,
		Content:   m.Content,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}
