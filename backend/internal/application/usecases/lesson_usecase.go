package usecases

import (
	"context"
	"time"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/domain/repositories"
	"github.com/google/uuid"
)

type LessonUseCase struct {
	lessonRepo repositories.LessonRepository
	moduleRepo repositories.ModuleRepository
}

func NewLessonUseCase(lessonRepo repositories.LessonRepository, moduleRepo repositories.ModuleRepository) *LessonUseCase {
	return &LessonUseCase{lessonRepo: lessonRepo, moduleRepo: moduleRepo}
}

func (uc *LessonUseCase) CreateLesson(ctx context.Context, moduleID, orgID uuid.UUID, req dto.CreateLessonRequest) (*dto.LessonDTO, error) {
	if _, err := uc.moduleRepo.FindByID(ctx, moduleID, orgID); err != nil {
		return nil, err
	}
	lesson := &entities.Lesson{
		ID:        uuid.New(),
		ModuleID:  moduleID,
		OrgID:     orgID,
		Title:     req.Title,
		Content:   req.Content,
		Type:      entities.LessonType(req.Type),
		VideoURL:  req.VideoURL,
		LinkURL:   req.LinkURL,
		FileURL:   req.FileURL,
		Position:  req.Position,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	if err := uc.lessonRepo.Create(ctx, lesson); err != nil {
		return nil, err
	}
	return toLessonDTO(lesson), nil
}

func (uc *LessonUseCase) GetLesson(ctx context.Context, id, orgID uuid.UUID) (*dto.LessonDTO, error) {
	lesson, err := uc.lessonRepo.FindByID(ctx, id, orgID)
	if err != nil {
		return nil, err
	}
	return toLessonDTO(lesson), nil
}

func (uc *LessonUseCase) ListLessons(ctx context.Context, moduleID, orgID uuid.UUID) ([]dto.LessonDTO, error) {
	lessons, err := uc.lessonRepo.FindByModule(ctx, moduleID, orgID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.LessonDTO, len(lessons))
	for i, l := range lessons {
		result[i] = *toLessonDTO(&l)
	}
	return result, nil
}

func (uc *LessonUseCase) UpdateLesson(ctx context.Context, id, orgID uuid.UUID, req dto.UpdateLessonRequest) (*dto.LessonDTO, error) {
	lesson, err := uc.lessonRepo.FindByID(ctx, id, orgID)
	if err != nil {
		return nil, err
	}
	if req.Title != "" {
		lesson.Title = req.Title
	}
	if req.Content != "" {
		lesson.Content = req.Content
	}
	if req.Type != "" {
		lesson.Type = entities.LessonType(req.Type)
	}
	if req.VideoURL != "" {
		lesson.VideoURL = req.VideoURL
	}
	if req.LinkURL != "" {
		lesson.LinkURL = req.LinkURL
	}
	if req.FileURL != "" {
		lesson.FileURL = req.FileURL
	}
	if req.Position > 0 {
		lesson.Position = req.Position
	}
	lesson.UpdatedAt = time.Now()
	if err := uc.lessonRepo.Update(ctx, lesson); err != nil {
		return nil, err
	}
	return toLessonDTO(lesson), nil
}

func (uc *LessonUseCase) DeleteLesson(ctx context.Context, id, orgID uuid.UUID) error {
	return uc.lessonRepo.Delete(ctx, id, orgID)
}
