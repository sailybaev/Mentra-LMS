package usecases

import (
	"context"
	"net/http"
	"testing"
	"time"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/mocks"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func TestModuleUseCase_CreateModule_Success(t *testing.T) {
	moduleRepo := new(mocks.MockModuleRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewModuleUseCase(moduleRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	course := &entities.Course{ID: courseID, OrgID: orgID}

	courseRepo.On("FindByID", mock.Anything, courseID, orgID).Return(course, nil)
	moduleRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.Module")).Return(nil)

	result, err := uc.CreateModule(context.Background(), courseID, orgID, dto.CreateModuleRequest{Title: "Week 1", Position: 1})
	require.NoError(t, err)
	assert.Equal(t, "Week 1", result.Title)
	assert.Equal(t, courseID.String(), result.CourseID)
	assert.Equal(t, orgID.String(), result.OrgID)
}

func TestModuleUseCase_CreateModule_CourseNotFound(t *testing.T) {
	moduleRepo := new(mocks.MockModuleRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewModuleUseCase(moduleRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	courseRepo.On("FindByID", mock.Anything, courseID, orgID).Return(nil, apperrors.NotFoundError("course", courseID.String()))

	_, err := uc.CreateModule(context.Background(), courseID, orgID, dto.CreateModuleRequest{Title: "Week 1"})
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusNotFound, appErr.HTTPStatus)
}

func TestModuleUseCase_GetModule_Success(t *testing.T) {
	moduleRepo := new(mocks.MockModuleRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewModuleUseCase(moduleRepo, courseRepo)

	orgID := uuid.New()
	moduleID := uuid.New()
	module := &entities.Module{ID: moduleID, OrgID: orgID, Title: "Week 1", Position: 1}
	moduleRepo.On("FindByID", mock.Anything, moduleID, orgID).Return(module, nil)

	result, err := uc.GetModule(context.Background(), moduleID, orgID)
	require.NoError(t, err)
	assert.Equal(t, "Week 1", result.Title)
}

func TestModuleUseCase_GetModule_NotFound(t *testing.T) {
	moduleRepo := new(mocks.MockModuleRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewModuleUseCase(moduleRepo, courseRepo)

	orgID := uuid.New()
	moduleID := uuid.New()
	moduleRepo.On("FindByID", mock.Anything, moduleID, orgID).Return(nil, apperrors.NotFoundError("module", moduleID.String()))

	_, err := uc.GetModule(context.Background(), moduleID, orgID)
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusNotFound, appErr.HTTPStatus)
}

func TestModuleUseCase_ListModules_Success(t *testing.T) {
	moduleRepo := new(mocks.MockModuleRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewModuleUseCase(moduleRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	modules := []entities.Module{
		{ID: uuid.New(), CourseID: courseID, OrgID: orgID, Title: "Week 1", Position: 1},
		{ID: uuid.New(), CourseID: courseID, OrgID: orgID, Title: "Week 2", Position: 2},
	}
	moduleRepo.On("FindByCourse", mock.Anything, courseID, orgID).Return(modules, nil)

	result, err := uc.ListModules(context.Background(), courseID, orgID)
	require.NoError(t, err)
	assert.Len(t, result, 2)
	assert.Equal(t, "Week 1", result[0].Title)
	assert.Equal(t, "Week 2", result[1].Title)
}

func TestModuleUseCase_UpdateModule_Success(t *testing.T) {
	moduleRepo := new(mocks.MockModuleRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewModuleUseCase(moduleRepo, courseRepo)

	orgID := uuid.New()
	moduleID := uuid.New()
	module := &entities.Module{
		ID: moduleID, OrgID: orgID, Title: "Old Title", Position: 1,
		CreatedAt: time.Now(), UpdatedAt: time.Now(),
	}
	moduleRepo.On("FindByID", mock.Anything, moduleID, orgID).Return(module, nil)
	moduleRepo.On("Update", mock.Anything, mock.AnythingOfType("*entities.Module")).Return(nil)

	result, err := uc.UpdateModule(context.Background(), moduleID, orgID, dto.UpdateModuleRequest{Title: "New Title", Position: 2})
	require.NoError(t, err)
	assert.Equal(t, "New Title", result.Title)
	assert.Equal(t, 2, result.Position)
}

func TestModuleUseCase_DeleteModule_Success(t *testing.T) {
	moduleRepo := new(mocks.MockModuleRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewModuleUseCase(moduleRepo, courseRepo)

	orgID := uuid.New()
	moduleID := uuid.New()
	moduleRepo.On("Delete", mock.Anything, moduleID, orgID).Return(nil)

	err := uc.DeleteModule(context.Background(), moduleID, orgID)
	require.NoError(t, err)
}
