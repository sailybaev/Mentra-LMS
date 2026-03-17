package repositories

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
)

type ExamRepository interface {
	Create(ctx context.Context, exam *entities.Exam) error
	FindByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Exam, error)
	FindByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]*entities.Exam, error)
	Update(ctx context.Context, exam *entities.Exam) error
	Delete(ctx context.Context, id, orgID uuid.UUID) error
}

type ExamAttemptRepository interface {
	Create(ctx context.Context, attempt *entities.ExamAttempt) error
	FindByID(ctx context.Context, id uuid.UUID) (*entities.ExamAttempt, error)
	FindByExamAndStudent(ctx context.Context, examID, studentID uuid.UUID) ([]*entities.ExamAttempt, error)
	FindByExam(ctx context.Context, examID uuid.UUID) ([]*entities.ExamAttempt, error)
	FindActiveAttempt(ctx context.Context, examID, studentID uuid.UUID) (*entities.ExamAttempt, error)
	Update(ctx context.Context, attempt *entities.ExamAttempt) error
	CountByExamAndStudent(ctx context.Context, examID, studentID uuid.UUID) (int, error)
}

type ExtraAttemptGrantRepository interface {
	Create(ctx context.Context, grant *entities.ExtraAttemptGrant) error
	SumByExamAndStudent(ctx context.Context, examID, studentID uuid.UUID) (int, error)
}
