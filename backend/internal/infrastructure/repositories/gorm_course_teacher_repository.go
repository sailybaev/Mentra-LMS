package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/infrastructure/database"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GORMCourseTeacherRepository struct {
	db *gorm.DB
}

func NewGORMCourseTeacherRepository(db *gorm.DB) *GORMCourseTeacherRepository {
	return &GORMCourseTeacherRepository{db: db}
}

func (r *GORMCourseTeacherRepository) Add(ctx context.Context, ct *entities.CourseTeacher) error {
	model := &database.CourseTeacherModel{
		ID:         ct.ID.String(),
		CourseID:   ct.CourseID.String(),
		TeacherID:  ct.TeacherID.String(),
		OrgID:      ct.OrgID.String(),
		AssignedAt: ct.AssignedAt,
	}
	if err := r.db.WithContext(ctx).Create(model).Error; err != nil {
		return apperrors.ConflictError("course teacher assignment")
	}
	return nil
}

func (r *GORMCourseTeacherRepository) Remove(ctx context.Context, courseID, teacherID, orgID uuid.UUID) error {
	result := r.db.WithContext(ctx).
		Where("course_id = ? AND teacher_id = ? AND org_id = ?", courseID.String(), teacherID.String(), orgID.String()).
		Delete(&database.CourseTeacherModel{})
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("course teacher", teacherID.String())
	}
	return nil
}

func (r *GORMCourseTeacherRepository) ListByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]entities.CourseTeacher, error) {
	var models []database.CourseTeacherModel
	err := r.db.WithContext(ctx).
		Where("course_id = ? AND org_id = ?", courseID.String(), orgID.String()).
		Order("assigned_at ASC").Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]entities.CourseTeacher, len(models))
	for i, m := range models {
		result[i] = *toCourseTeacherEntity(&m)
	}
	return result, nil
}

func (r *GORMCourseTeacherRepository) ListByTeacher(ctx context.Context, teacherID, orgID uuid.UUID) ([]entities.CourseTeacher, error) {
	var models []database.CourseTeacherModel
	err := r.db.WithContext(ctx).
		Where("teacher_id = ? AND org_id = ?", teacherID.String(), orgID.String()).
		Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]entities.CourseTeacher, len(models))
	for i, m := range models {
		result[i] = *toCourseTeacherEntity(&m)
	}
	return result, nil
}

func (r *GORMCourseTeacherRepository) Exists(ctx context.Context, courseID, teacherID, orgID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&database.CourseTeacherModel{}).
		Where("course_id = ? AND teacher_id = ? AND org_id = ?", courseID.String(), teacherID.String(), orgID.String()).
		Count(&count).Error
	if err != nil {
		return false, apperrors.InternalError(err.Error())
	}
	return count > 0, nil
}

func (r *GORMCourseTeacherRepository) FindCourseIDsByTeacher(ctx context.Context, teacherID, orgID uuid.UUID) ([]uuid.UUID, error) {
	var models []database.CourseTeacherModel
	err := r.db.WithContext(ctx).
		Select("course_id").
		Where("teacher_id = ? AND org_id = ?", teacherID.String(), orgID.String()).
		Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	ids := make([]uuid.UUID, 0, len(models))
	for _, m := range models {
		if id, err := uuid.Parse(m.CourseID); err == nil {
			ids = append(ids, id)
		}
	}
	return ids, nil
}

func toCourseTeacherEntity(m *database.CourseTeacherModel) *entities.CourseTeacher {
	id, _ := uuid.Parse(m.ID)
	courseID, _ := uuid.Parse(m.CourseID)
	teacherID, _ := uuid.Parse(m.TeacherID)
	orgID, _ := uuid.Parse(m.OrgID)
	return &entities.CourseTeacher{
		ID:         id,
		CourseID:   courseID,
		TeacherID:  teacherID,
		OrgID:      orgID,
		AssignedAt: m.AssignedAt,
	}
}

