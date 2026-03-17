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

type GORMQuizAttemptRepository struct {
	db *gorm.DB
}

func NewGORMQuizAttemptRepository(db *gorm.DB) *GORMQuizAttemptRepository {
	return &GORMQuizAttemptRepository{db: db}
}

func (r *GORMQuizAttemptRepository) Create(ctx context.Context, a *entities.QuizAttempt) error {
	model, err := toQuizAttemptModel(a)
	if err != nil {
		return apperrors.InternalError(err.Error())
	}
	return r.db.WithContext(ctx).Create(model).Error
}

func (r *GORMQuizAttemptRepository) FindByQuizAndStudent(ctx context.Context, quizID, studentID uuid.UUID) (*entities.QuizAttempt, error) {
	var model database.QuizAttemptModel
	err := r.db.WithContext(ctx).First(&model, "quiz_id = ? AND student_id = ?", quizID.String(), studentID.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("quiz attempt", quizID.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toQuizAttemptEntity(&model)
}

func (r *GORMQuizAttemptRepository) FindByQuiz(ctx context.Context, quizID uuid.UUID) ([]*entities.QuizAttempt, error) {
	var models []database.QuizAttemptModel
	err := r.db.WithContext(ctx).Where("quiz_id = ?", quizID.String()).Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]*entities.QuizAttempt, len(models))
	for i := range models {
		e, err := toQuizAttemptEntity(&models[i])
		if err != nil {
			return nil, err
		}
		result[i] = e
	}
	return result, nil
}

func toQuizAttemptModel(a *entities.QuizAttempt) (*database.QuizAttemptModel, error) {
	answersJSON, err := json.Marshal(a.Answers)
	if err != nil {
		return nil, err
	}
	return &database.QuizAttemptModel{
		ID:          a.ID.String(),
		QuizID:      a.QuizID.String(),
		StudentID:   a.StudentID.String(),
		OrgID:       a.OrgID.String(),
		Score:       a.Score,
		MaxScore:    a.MaxScore,
		Answers:     string(answersJSON),
		SubmittedAt: a.SubmittedAt,
		CreatedAt:   a.CreatedAt,
		UpdatedAt:   a.UpdatedAt,
	}, nil
}

func toQuizAttemptEntity(m *database.QuizAttemptModel) (*entities.QuizAttempt, error) {
	id, _ := uuid.Parse(m.ID)
	quizID, _ := uuid.Parse(m.QuizID)
	studentID, _ := uuid.Parse(m.StudentID)
	orgID, _ := uuid.Parse(m.OrgID)
	var answers []entities.QuizAttemptAnswer
	if m.Answers != "" {
		if err := json.Unmarshal([]byte(m.Answers), &answers); err != nil {
			return nil, apperrors.InternalError("failed to parse answers: " + err.Error())
		}
	}
	return &entities.QuizAttempt{
		ID:          id,
		QuizID:      quizID,
		StudentID:   studentID,
		OrgID:       orgID,
		Score:       m.Score,
		MaxScore:    m.MaxScore,
		Answers:     answers,
		SubmittedAt: m.SubmittedAt,
		CreatedAt:   m.CreatedAt,
		UpdatedAt:   m.UpdatedAt,
	}, nil
}
