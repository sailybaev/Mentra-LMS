package usecases

import (
	"context"
	"time"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/domain/repositories"
	"github.com/google/uuid"
)

type QuizUseCase struct {
	quizRepo   repositories.QuizRepository
	lessonRepo repositories.LessonRepository
}

func NewQuizUseCase(quizRepo repositories.QuizRepository, lessonRepo repositories.LessonRepository) *QuizUseCase {
	return &QuizUseCase{quizRepo: quizRepo, lessonRepo: lessonRepo}
}

func (uc *QuizUseCase) CreateQuiz(ctx context.Context, lessonID, orgID uuid.UUID, req dto.CreateQuizRequest) (*dto.QuizDTO, error) {
	if _, err := uc.lessonRepo.FindByID(ctx, lessonID, orgID); err != nil {
		return nil, err
	}

	questions := make([]entities.QuizQuestion, len(req.Questions))
	for i, q := range req.Questions {
		answers := make([]entities.QuizAnswer, len(q.Answers))
		for j, a := range q.Answers {
			answers[j] = entities.QuizAnswer{
				ID:        uuid.New(),
				Answer:    a.Answer,
				IsCorrect: a.IsCorrect,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}
		}
		questions[i] = entities.QuizQuestion{
			ID:        uuid.New(),
			Question:  q.Question,
			Position:  q.Position,
			Answers:   answers,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
	}

	quiz := &entities.Quiz{
		ID:        uuid.New(),
		LessonID:  lessonID,
		OrgID:     orgID,
		Title:     req.Title,
		Questions: questions,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	if err := uc.quizRepo.Create(ctx, quiz); err != nil {
		return nil, err
	}
	return toQuizDTO(quiz), nil
}

func (uc *QuizUseCase) GetQuiz(ctx context.Context, id, orgID uuid.UUID) (*dto.QuizDTO, error) {
	quiz, err := uc.quizRepo.FindByID(ctx, id, orgID)
	if err != nil {
		return nil, err
	}
	return toQuizDTO(quiz), nil
}

func (uc *QuizUseCase) GetQuizByLesson(ctx context.Context, lessonID, orgID uuid.UUID) (*dto.QuizDTO, error) {
	quiz, err := uc.quizRepo.FindByLesson(ctx, lessonID, orgID)
	if err != nil {
		return nil, err
	}
	return toQuizDTO(quiz), nil
}

func (uc *QuizUseCase) UpdateQuiz(ctx context.Context, quizID, orgID uuid.UUID, req dto.UpdateQuizRequest) (*dto.QuizDTO, error) {
	existing, err := uc.quizRepo.FindByID(ctx, quizID, orgID)
	if err != nil {
		return nil, err
	}

	title := existing.Title
	if req.Title != "" {
		title = req.Title
	}

	questions := make([]entities.QuizQuestion, len(req.Questions))
	for i, q := range req.Questions {
		answers := make([]entities.QuizAnswer, len(q.Answers))
		for j, a := range q.Answers {
			answers[j] = entities.QuizAnswer{
				ID:        uuid.New(),
				Answer:    a.Answer,
				IsCorrect: a.IsCorrect,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}
		}
		questions[i] = entities.QuizQuestion{
			ID:        uuid.New(),
			QuizID:    quizID,
			Question:  q.Question,
			Position:  q.Position,
			Answers:   answers,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
	}

	updated := &entities.Quiz{
		ID:        existing.ID,
		LessonID:  existing.LessonID,
		OrgID:     existing.OrgID,
		Title:     title,
		Questions: questions,
		CreatedAt: existing.CreatedAt,
		UpdatedAt: time.Now(),
	}
	if err := uc.quizRepo.Update(ctx, updated); err != nil {
		return nil, err
	}
	return toQuizDTO(updated), nil
}

func (uc *QuizUseCase) DeleteQuiz(ctx context.Context, quizID, orgID uuid.UUID) error {
	return uc.quizRepo.Delete(ctx, quizID, orgID)
}

func toQuizDTO(q *entities.Quiz) *dto.QuizDTO {
	questions := make([]dto.QuestionDTO, len(q.Questions))
	for i, qn := range q.Questions {
		answers := make([]dto.AnswerDTO, len(qn.Answers))
		for j, a := range qn.Answers {
			answers[j] = dto.AnswerDTO{
				ID:        a.ID.String(),
				Answer:    a.Answer,
				IsCorrect: a.IsCorrect,
			}
		}
		questions[i] = dto.QuestionDTO{
			ID:       qn.ID.String(),
			Question: qn.Question,
			Position: qn.Position,
			Answers:  answers,
		}
	}
	return &dto.QuizDTO{
		ID:        q.ID.String(),
		LessonID:  q.LessonID.String(),
		OrgID:     q.OrgID.String(),
		Title:     q.Title,
		Questions: questions,
		CreatedAt: q.CreatedAt,
		UpdatedAt: q.UpdatedAt,
	}
}
