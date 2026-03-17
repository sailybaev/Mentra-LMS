package usecases

import (
	"context"
	"time"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/domain/repositories"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
)

type QuizAttemptUseCase struct {
	attemptRepo repositories.QuizAttemptRepository
	quizRepo    repositories.QuizRepository
}

func NewQuizAttemptUseCase(attemptRepo repositories.QuizAttemptRepository, quizRepo repositories.QuizRepository) *QuizAttemptUseCase {
	return &QuizAttemptUseCase{attemptRepo: attemptRepo, quizRepo: quizRepo}
}

func (uc *QuizAttemptUseCase) Submit(ctx context.Context, quizID, studentID, orgID uuid.UUID, answers []dto.QuizAnswerInput) (*dto.QuizAttemptResultDTO, error) {
	quiz, err := uc.quizRepo.FindByID(ctx, quizID, orgID)
	if err != nil {
		return nil, err
	}

	// Check deadline
	if quiz.DueDate != nil && time.Now().After(*quiz.DueDate) && !quiz.AllowLateSubmission {
		return nil, apperrors.ValidationError("quiz deadline has passed")
	}

	// Check if already attempted
	existing, err := uc.attemptRepo.FindByQuizAndStudent(ctx, quizID, studentID)
	if err == nil && existing != nil {
		return toQuizAttemptResultDTO(existing), nil
	}

	// Build answer map for fast lookup
	answerMap := make(map[string]string)
	for _, a := range answers {
		answerMap[a.QuestionID] = a.AnswerID
	}

	// Auto-grade
	correct := 0
	for _, q := range quiz.Questions {
		selectedAnswerID := answerMap[q.ID.String()]
		for _, a := range q.Answers {
			if a.ID.String() == selectedAnswerID && a.IsCorrect {
				correct++
				break
			}
		}
	}

	maxScore := len(quiz.Questions)
	attemptAnswers := make([]entities.QuizAttemptAnswer, len(answers))
	for i, a := range answers {
		attemptAnswers[i] = entities.QuizAttemptAnswer{
			QuestionID: a.QuestionID,
			AnswerID:   a.AnswerID,
		}
	}

	attempt := &entities.QuizAttempt{
		ID:          uuid.New(),
		QuizID:      quizID,
		StudentID:   studentID,
		OrgID:       orgID,
		Score:       correct,
		MaxScore:    maxScore,
		Answers:     attemptAnswers,
		SubmittedAt: time.Now(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := uc.attemptRepo.Create(ctx, attempt); err != nil {
		return nil, err
	}
	return toQuizAttemptResultDTO(attempt), nil
}

func (uc *QuizAttemptUseCase) GetMyAttempt(ctx context.Context, quizID, studentID uuid.UUID) (*dto.QuizAttemptResultDTO, error) {
	attempt, err := uc.attemptRepo.FindByQuizAndStudent(ctx, quizID, studentID)
	if err != nil {
		return nil, err
	}
	return toQuizAttemptResultDTO(attempt), nil
}

func toQuizAttemptResultDTO(a *entities.QuizAttempt) *dto.QuizAttemptResultDTO {
	var pct float64
	if a.MaxScore > 0 {
		pct = float64(a.Score) / float64(a.MaxScore) * 100
	}
	return &dto.QuizAttemptResultDTO{
		ID:          a.ID.String(),
		QuizID:      a.QuizID.String(),
		Score:       a.Score,
		MaxScore:    a.MaxScore,
		Percentage:  pct,
		SubmittedAt: a.SubmittedAt,
	}
}
