package usecases

import (
	"context"
	"time"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/domain/repositories"
	"github.com/google/uuid"
)

type ModuleUseCase struct {
	moduleRepo repositories.ModuleRepository
	courseRepo repositories.CourseRepository
}

func NewModuleUseCase(moduleRepo repositories.ModuleRepository, courseRepo repositories.CourseRepository) *ModuleUseCase {
	return &ModuleUseCase{moduleRepo: moduleRepo, courseRepo: courseRepo}
}

func (uc *ModuleUseCase) CreateModule(ctx context.Context, courseID, orgID uuid.UUID, req dto.CreateModuleRequest) (*dto.ModuleDTO, error) {
	if _, err := uc.courseRepo.FindByID(ctx, courseID, orgID); err != nil {
		return nil, err
	}
	module := &entities.Module{
		ID:        uuid.New(),
		CourseID:  courseID,
		OrgID:     orgID,
		Title:     req.Title,
		Position:  req.Position,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	if err := uc.moduleRepo.Create(ctx, module); err != nil {
		return nil, err
	}
	return toModuleDTO(module), nil
}

func (uc *ModuleUseCase) GetModule(ctx context.Context, id, orgID uuid.UUID) (*dto.ModuleDTO, error) {
	module, err := uc.moduleRepo.FindByID(ctx, id, orgID)
	if err != nil {
		return nil, err
	}
	return toModuleDTO(module), nil
}

func (uc *ModuleUseCase) ListModules(ctx context.Context, courseID, orgID uuid.UUID) ([]dto.ModuleDTO, error) {
	modules, err := uc.moduleRepo.FindByCourse(ctx, courseID, orgID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.ModuleDTO, len(modules))
	for i, m := range modules {
		result[i] = *toModuleDTO(&m)
	}
	return result, nil
}

func (uc *ModuleUseCase) UpdateModule(ctx context.Context, id, orgID uuid.UUID, req dto.UpdateModuleRequest) (*dto.ModuleDTO, error) {
	module, err := uc.moduleRepo.FindByID(ctx, id, orgID)
	if err != nil {
		return nil, err
	}
	if req.Title != "" {
		module.Title = req.Title
	}
	if req.Position > 0 {
		module.Position = req.Position
	}
	module.UpdatedAt = time.Now()
	if err := uc.moduleRepo.Update(ctx, module); err != nil {
		return nil, err
	}
	return toModuleDTO(module), nil
}

func (uc *ModuleUseCase) DeleteModule(ctx context.Context, id, orgID uuid.UUID) error {
	return uc.moduleRepo.Delete(ctx, id, orgID)
}
