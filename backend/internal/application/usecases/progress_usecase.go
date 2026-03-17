package usecases

import (
	"context"
	"time"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/domain/repositories"
	"github.com/ailms/backend/internal/domain/services"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
)

type ProgressUseCase struct {
	progressRepo repositories.LessonProgressRepository
	lessonRepo   repositories.LessonRepository
	aiService    services.AIService
}

func NewProgressUseCase(
	progressRepo repositories.LessonProgressRepository,
	lessonRepo repositories.LessonRepository,
	aiService services.AIService,
) *ProgressUseCase {
	return &ProgressUseCase{progressRepo: progressRepo, lessonRepo: lessonRepo, aiService: aiService}
}

func (uc *ProgressUseCase) CompleteLesson(ctx context.Context, userID, lessonID, orgID uuid.UUID, score *float64) error {
	if _, err := uc.lessonRepo.FindByID(ctx, lessonID, orgID); err != nil {
		return err
	}

	existing, _ := uc.progressRepo.FindByUserAndLesson(ctx, userID, lessonID, orgID)
	now := time.Now()
	if existing != nil {
		existing.CompletedAt = &now
		existing.Score = score
		existing.UpdatedAt = now
		return uc.progressRepo.Update(ctx, existing)
	}

	progress := &entities.LessonProgress{
		ID:          uuid.New(),
		UserID:      userID,
		LessonID:    lessonID,
		OrgID:       orgID,
		CompletedAt: &now,
		Score:       score,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	return uc.progressRepo.Create(ctx, progress)
}

func (uc *ProgressUseCase) GetStudentProgress(ctx context.Context, userID, orgID uuid.UUID) ([]dto.ProgressDTO, error) {
	progresses, err := uc.progressRepo.FindByUser(ctx, userID, orgID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.ProgressDTO, len(progresses))
	for i, p := range progresses {
		result[i] = toProgressDTO(&p)
	}
	return result, nil
}

func (uc *ProgressUseCase) GetProgressInsights(ctx context.Context, userID, orgID uuid.UUID) (*dto.InsightsDTO, error) {
	progresses, err := uc.progressRepo.FindByUser(ctx, userID, orgID)
	if err != nil {
		return nil, err
	}

	if len(progresses) == 0 {
		return nil, apperrors.NotFoundError("progress", userID.String())
	}

	insights, err := uc.aiService.GenerateProgressInsights(ctx, progresses)
	if err != nil {
		insights = "Unable to generate insights at this time."
	}

	var totalScore float64
	var scoredCount int
	for _, p := range progresses {
		if p.Score != nil {
			totalScore += *p.Score
			scoredCount++
		}
	}
	avgScore := 0.0
	if scoredCount > 0 {
		avgScore = totalScore / float64(scoredCount)
	}

	return &dto.InsightsDTO{
		Insights:         insights,
		TotalLessons:     len(progresses),
		CompletedLessons: len(progresses),
		AverageScore:     avgScore,
	}, nil
}

func toProgressDTO(p *entities.LessonProgress) dto.ProgressDTO {
	return dto.ProgressDTO{
		ID:          p.ID.String(),
		UserID:      p.UserID.String(),
		LessonID:    p.LessonID.String(),
		OrgID:       p.OrgID.String(),
		CompletedAt: p.CompletedAt,
		Score:       p.Score,
		CreatedAt:   p.CreatedAt,
	}
}
