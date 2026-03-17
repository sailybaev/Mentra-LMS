package repositories

import (
	"context"
	"encoding/json"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/infrastructure/database"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GORMExamAttemptRepository struct {
	db *gorm.DB
}

func NewGORMExamAttemptRepository(db *gorm.DB) *GORMExamAttemptRepository {
	return &GORMExamAttemptRepository{db: db}
}

func (r *GORMExamAttemptRepository) Create(ctx context.Context, attempt *entities.ExamAttempt) error {
	model, err := toExamAttemptModel(attempt)
	if err != nil {
		return apperrors.InternalError(err.Error())
	}
	return r.db.WithContext(ctx).Create(model).Error
}

func (r *GORMExamAttemptRepository) FindByID(ctx context.Context, id uuid.UUID) (*entities.ExamAttempt, error) {
	var model database.ExamAttemptModel
	err := r.db.WithContext(ctx).First(&model, "id = ?", id.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("exam attempt", id.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toExamAttemptEntity(&model)
}

func (r *GORMExamAttemptRepository) FindByExamAndStudent(ctx context.Context, examID, studentID uuid.UUID) ([]*entities.ExamAttempt, error) {
	var models []database.ExamAttemptModel
	err := r.db.WithContext(ctx).
		Where("exam_id = ? AND student_id = ?", examID.String(), studentID.String()).
		Order("created_at ASC").
		Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]*entities.ExamAttempt, len(models))
	for i := range models {
		e, err := toExamAttemptEntity(&models[i])
		if err != nil {
			return nil, err
		}
		result[i] = e
	}
	return result, nil
}

func (r *GORMExamAttemptRepository) FindByExam(ctx context.Context, examID uuid.UUID) ([]*entities.ExamAttempt, error) {
	var models []database.ExamAttemptModel
	err := r.db.WithContext(ctx).
		Where("exam_id = ?", examID.String()).
		Order("created_at ASC").
		Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]*entities.ExamAttempt, len(models))
	for i := range models {
		e, err := toExamAttemptEntity(&models[i])
		if err != nil {
			return nil, err
		}
		result[i] = e
	}
	return result, nil
}

func (r *GORMExamAttemptRepository) FindActiveAttempt(ctx context.Context, examID, studentID uuid.UUID) (*entities.ExamAttempt, error) {
	var model database.ExamAttemptModel
	err := r.db.WithContext(ctx).
		First(&model, "exam_id = ? AND student_id = ? AND status = ?", examID.String(), studentID.String(), "in_progress").Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toExamAttemptEntity(&model)
}

func (r *GORMExamAttemptRepository) Update(ctx context.Context, attempt *entities.ExamAttempt) error {
	model, err := toExamAttemptModel(attempt)
	if err != nil {
		return apperrors.InternalError(err.Error())
	}
	return r.db.WithContext(ctx).Save(model).Error
}

func (r *GORMExamAttemptRepository) CountByExamAndStudent(ctx context.Context, examID, studentID uuid.UUID) (int, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&database.ExamAttemptModel{}).
		Where("exam_id = ? AND student_id = ?", examID.String(), studentID.String()).
		Count(&count).Error
	if err != nil {
		return 0, apperrors.InternalError(err.Error())
	}
	return int(count), nil
}

func toExamAttemptModel(a *entities.ExamAttempt) (*database.ExamAttemptModel, error) {
	answersJSON, err := json.Marshal(a.MCQAnswers)
	if err != nil {
		return nil, err
	}
	var gradedBy *string
	if a.GradedBy != nil {
		s := a.GradedBy.String()
		gradedBy = &s
	}
	return &database.ExamAttemptModel{
		ID:           a.ID.String(),
		ExamID:       a.ExamID.String(),
		StudentID:    a.StudentID.String(),
		OrgID:        a.OrgID.String(),
		Status:       a.Status,
		StartedAt:    a.StartedAt,
		ExpiresAt:    a.ExpiresAt,
		SubmittedAt:  a.SubmittedAt,
		MCQAnswers:   string(answersJSON),
		MCQScore:     a.MCQScore,
		MCQMaxScore:  a.MCQMaxScore,
		FilePath:     a.FilePath,
		FileFeedback: a.FileFeedback,
		FileScore:    a.FileScore,
		FilePoints:   a.FilePoints,
		TotalScore:   a.TotalScore,
		GradedBy:     gradedBy,
		GradedAt:     a.GradedAt,
		CreatedAt:    a.CreatedAt,
		UpdatedAt:    a.UpdatedAt,
	}, nil
}

func toExamAttemptEntity(m *database.ExamAttemptModel) (*entities.ExamAttempt, error) {
	id, _ := uuid.Parse(m.ID)
	examID, _ := uuid.Parse(m.ExamID)
	studentID, _ := uuid.Parse(m.StudentID)
	orgID, _ := uuid.Parse(m.OrgID)

	var answers []entities.ExamMCQAnswer
	if m.MCQAnswers != "" {
		if err := json.Unmarshal([]byte(m.MCQAnswers), &answers); err != nil {
			return nil, apperrors.InternalError("failed to parse mcq answers: " + err.Error())
		}
	}

	var gradedBy *uuid.UUID
	if m.GradedBy != nil {
		parsed, err := uuid.Parse(*m.GradedBy)
		if err == nil {
			gradedBy = &parsed
		}
	}

	return &entities.ExamAttempt{
		ID:           id,
		ExamID:       examID,
		StudentID:    studentID,
		OrgID:        orgID,
		Status:       m.Status,
		StartedAt:    m.StartedAt,
		ExpiresAt:    m.ExpiresAt,
		SubmittedAt:  m.SubmittedAt,
		MCQAnswers:   answers,
		MCQScore:     m.MCQScore,
		MCQMaxScore:  m.MCQMaxScore,
		FilePath:     m.FilePath,
		FileFeedback: m.FileFeedback,
		FileScore:    m.FileScore,
		FilePoints:   m.FilePoints,
		TotalScore:   m.TotalScore,
		GradedBy:     gradedBy,
		GradedAt:     m.GradedAt,
		CreatedAt:    m.CreatedAt,
		UpdatedAt:    m.UpdatedAt,
	}, nil
}
