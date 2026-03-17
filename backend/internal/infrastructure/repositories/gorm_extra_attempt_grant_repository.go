package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/infrastructure/database"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GORMExtraAttemptGrantRepository struct {
	db *gorm.DB
}

func NewGORMExtraAttemptGrantRepository(db *gorm.DB) *GORMExtraAttemptGrantRepository {
	return &GORMExtraAttemptGrantRepository{db: db}
}

func (r *GORMExtraAttemptGrantRepository) Create(ctx context.Context, grant *entities.ExtraAttemptGrant) error {
	model := &database.ExtraAttemptGrantModel{
		ID:         grant.ID.String(),
		ExamID:     grant.ExamID.String(),
		StudentID:  grant.StudentID.String(),
		OrgID:      grant.OrgID.String(),
		GrantedBy:  grant.GrantedBy.String(),
		ExtraCount: grant.ExtraCount,
		CreatedAt:  grant.CreatedAt,
	}
	return r.db.WithContext(ctx).Create(model).Error
}

func (r *GORMExtraAttemptGrantRepository) SumByExamAndStudent(ctx context.Context, examID, studentID uuid.UUID) (int, error) {
	var total int64
	err := r.db.WithContext(ctx).Model(&database.ExtraAttemptGrantModel{}).
		Where("exam_id = ? AND student_id = ?", examID.String(), studentID.String()).
		Select("COALESCE(SUM(extra_count), 0)").
		Scan(&total).Error
	if err != nil {
		return 0, apperrors.InternalError(err.Error())
	}
	return int(total), nil
}
