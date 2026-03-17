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

type GORMQuizRepository struct {
	db *gorm.DB
}

func NewGORMQuizRepository(db *gorm.DB) *GORMQuizRepository {
	return &GORMQuizRepository{db: db}
}

func (r *GORMQuizRepository) Create(ctx context.Context, quiz *entities.Quiz) error {
	model := toQuizModel(quiz)
	return r.db.WithContext(ctx).Create(model).Error
}

func (r *GORMQuizRepository) FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Quiz, error) {
	var model database.QuizModel
	err := r.db.WithContext(ctx).
		Preload("Questions.Answers").
		First(&model, "id = ? AND org_id = ?", id.String(), orgID.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("quiz", id.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toQuizEntity(&model), nil
}

func (r *GORMQuizRepository) FindByLesson(ctx context.Context, lessonID, orgID uuid.UUID) (*entities.Quiz, error) {
	var model database.QuizModel
	err := r.db.WithContext(ctx).
		Preload("Questions.Answers").
		First(&model, "lesson_id = ? AND org_id = ?", lessonID.String(), orgID.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("quiz", lessonID.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toQuizEntity(&model), nil
}

func (r *GORMQuizRepository) Update(ctx context.Context, quiz *entities.Quiz) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var questionIDs []string
		if err := tx.Model(&database.QuizQuestionModel{}).
			Where("quiz_id = ?", quiz.ID.String()).
			Pluck("id", &questionIDs).Error; err != nil {
			return apperrors.InternalError(err.Error())
		}

		if len(questionIDs) > 0 {
			if err := tx.Where("question_id IN ?", questionIDs).
				Delete(&database.QuizAnswerModel{}).Error; err != nil {
				return apperrors.InternalError(err.Error())
			}
		}

		if err := tx.Where("quiz_id = ?", quiz.ID.String()).
			Delete(&database.QuizQuestionModel{}).Error; err != nil {
			return apperrors.InternalError(err.Error())
		}

		quiz.UpdatedAt = time.Now()
		quizRecord := &database.QuizModel{
			ID:        quiz.ID.String(),
			LessonID:  quiz.LessonID.String(),
			OrgID:     quiz.OrgID.String(),
			Title:     quiz.Title,
			CreatedAt: quiz.CreatedAt,
			UpdatedAt: quiz.UpdatedAt,
		}
		if err := tx.Save(quizRecord).Error; err != nil {
			return apperrors.InternalError(err.Error())
		}

		for _, q := range quiz.Questions {
			qModel := database.QuizQuestionModel{
				ID:        q.ID.String(),
				QuizID:    quiz.ID.String(),
				Question:  q.Question,
				Position:  q.Position,
				CreatedAt: q.CreatedAt,
				UpdatedAt: q.UpdatedAt,
			}
			if err := tx.Create(&qModel).Error; err != nil {
				return apperrors.InternalError(err.Error())
			}
			for _, a := range q.Answers {
				aModel := database.QuizAnswerModel{
					ID:         a.ID.String(),
					QuestionID: q.ID.String(),
					Answer:     a.Answer,
					IsCorrect:  a.IsCorrect,
					CreatedAt:  a.CreatedAt,
					UpdatedAt:  a.UpdatedAt,
				}
				if err := tx.Create(&aModel).Error; err != nil {
					return apperrors.InternalError(err.Error())
				}
			}
		}
		return nil
	})
}

func (r *GORMQuizRepository) Delete(ctx context.Context, id, orgID uuid.UUID) error {
	result := r.db.WithContext(ctx).Where("id = ? AND org_id = ?", id.String(), orgID.String()).Delete(&database.QuizModel{})
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("quiz", id.String())
	}
	return nil
}

func toQuizModel(q *entities.Quiz) *database.QuizModel {
	questions := make([]database.QuizQuestionModel, len(q.Questions))
	for i, qn := range q.Questions {
		answers := make([]database.QuizAnswerModel, len(qn.Answers))
		for j, a := range qn.Answers {
			answers[j] = database.QuizAnswerModel{
				ID:         a.ID.String(),
				QuestionID: qn.ID.String(),
				Answer:     a.Answer,
				IsCorrect:  a.IsCorrect,
				CreatedAt:  a.CreatedAt,
				UpdatedAt:  a.UpdatedAt,
			}
		}
		questions[i] = database.QuizQuestionModel{
			ID:        qn.ID.String(),
			QuizID:    q.ID.String(),
			Question:  qn.Question,
			Position:  qn.Position,
			Answers:   answers,
			CreatedAt: qn.CreatedAt,
			UpdatedAt: qn.UpdatedAt,
		}
	}
	return &database.QuizModel{
		ID:        q.ID.String(),
		LessonID:  q.LessonID.String(),
		OrgID:     q.OrgID.String(),
		Title:     q.Title,
		Questions: questions,
		CreatedAt: q.CreatedAt,
		UpdatedAt: q.UpdatedAt,
	}
}

func toQuizEntity(m *database.QuizModel) *entities.Quiz {
	id, _ := uuid.Parse(m.ID)
	lessonID, _ := uuid.Parse(m.LessonID)
	orgID, _ := uuid.Parse(m.OrgID)
	questions := make([]entities.QuizQuestion, len(m.Questions))
	for i, qm := range m.Questions {
		qID, _ := uuid.Parse(qm.ID)
		quizID, _ := uuid.Parse(qm.QuizID)
		answers := make([]entities.QuizAnswer, len(qm.Answers))
		for j, am := range qm.Answers {
			aID, _ := uuid.Parse(am.ID)
			qnID, _ := uuid.Parse(am.QuestionID)
			answers[j] = entities.QuizAnswer{
				ID:         aID,
				QuestionID: qnID,
				Answer:     am.Answer,
				IsCorrect:  am.IsCorrect,
				CreatedAt:  am.CreatedAt,
				UpdatedAt:  am.UpdatedAt,
			}
		}
		questions[i] = entities.QuizQuestion{
			ID:        qID,
			QuizID:    quizID,
			Question:  qm.Question,
			Position:  qm.Position,
			Answers:   answers,
			CreatedAt: qm.CreatedAt,
			UpdatedAt: qm.UpdatedAt,
		}
	}
	return &entities.Quiz{
		ID:        id,
		LessonID:  lessonID,
		OrgID:     orgID,
		Title:     m.Title,
		Questions: questions,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}
