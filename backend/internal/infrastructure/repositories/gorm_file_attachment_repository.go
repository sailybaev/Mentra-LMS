package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/infrastructure/database"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GORMFileAttachmentRepository struct {
	db *gorm.DB
}

func NewGORMFileAttachmentRepository(db *gorm.DB) *GORMFileAttachmentRepository {
	return &GORMFileAttachmentRepository{db: db}
}

func (r *GORMFileAttachmentRepository) Create(ctx context.Context, f *entities.FileAttachment) error {
	return r.db.WithContext(ctx).Create(toFileAttachmentModel(f)).Error
}

func (r *GORMFileAttachmentRepository) FindByRef(ctx context.Context, refType string, refID uuid.UUID) ([]*entities.FileAttachment, error) {
	var models []database.FileAttachmentModel
	err := r.db.WithContext(ctx).Where("ref_type = ? AND ref_id = ?", refType, refID.String()).Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]*entities.FileAttachment, len(models))
	for i := range models {
		result[i] = toFileAttachmentEntity(&models[i])
	}
	return result, nil
}

func (r *GORMFileAttachmentRepository) FindByID(ctx context.Context, id uuid.UUID) (*entities.FileAttachment, error) {
	var model database.FileAttachmentModel
	err := r.db.WithContext(ctx).First(&model, "id = ?", id.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("file attachment", id.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toFileAttachmentEntity(&model), nil
}

func (r *GORMFileAttachmentRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Where("id = ?", id.String()).Delete(&database.FileAttachmentModel{})
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("file attachment", id.String())
	}
	return nil
}

func toFileAttachmentModel(f *entities.FileAttachment) *database.FileAttachmentModel {
	return &database.FileAttachmentModel{
		ID:           f.ID.String(),
		OrgID:        f.OrgID.String(),
		UploaderID:   f.UploaderID.String(),
		OriginalName: f.OriginalName,
		StoredPath:   f.StoredPath,
		MimeType:     f.MimeType,
		SizeBytes:    f.SizeBytes,
		RefType:      f.RefType,
		RefID:        f.RefID.String(),
		CreatedAt:    f.CreatedAt,
	}
}

func toFileAttachmentEntity(m *database.FileAttachmentModel) *entities.FileAttachment {
	id, _ := uuid.Parse(m.ID)
	orgID, _ := uuid.Parse(m.OrgID)
	uploaderID, _ := uuid.Parse(m.UploaderID)
	refID, _ := uuid.Parse(m.RefID)
	return &entities.FileAttachment{
		ID:           id,
		OrgID:        orgID,
		UploaderID:   uploaderID,
		OriginalName: m.OriginalName,
		StoredPath:   m.StoredPath,
		MimeType:     m.MimeType,
		SizeBytes:    m.SizeBytes,
		RefType:      m.RefType,
		RefID:        refID,
		CreatedAt:    m.CreatedAt,
	}
}
