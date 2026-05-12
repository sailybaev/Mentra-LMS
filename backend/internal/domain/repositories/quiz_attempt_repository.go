package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type QuizAttemptRepository interface {
	Create(ctx context.Context, a *entities.QuizAttempt) error
	FindByQuizAndStudent(ctx context.Context, quizID, studentID uuid.UUID) (*entities.QuizAttempt, error)
	FindByQuiz(ctx context.Context, quizID uuid.UUID) ([]*entities.QuizAttempt, error)
	FindByStudentAndQuizzes(ctx context.Context, studentID uuid.UUID, quizIDs []uuid.UUID) ([]*entities.QuizAttempt, error)
}
