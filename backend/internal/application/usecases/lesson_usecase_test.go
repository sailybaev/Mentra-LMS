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

func TestLessonUseCase_CreateLesson_Success(t *testing.T) {
	lessonRepo := new(mocks.MockLessonRepository)
	moduleRepo := new(mocks.MockModuleRepository)
	uc := NewLessonUseCase(lessonRepo, moduleRepo)

	orgID := uuid.New()
	moduleID := uuid.New()
	module := &entities.Module{ID: moduleID, OrgID: orgID}

	moduleRepo.On("FindByID", mock.Anything, moduleID, orgID).Return(module, nil)
	lessonRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.Lesson")).Return(nil)

	req := dto.CreateLessonRequest{Title: "Introduction", Content: "Welcome", Type: "text", Position: 1}
	result, err := uc.CreateLesson(context.Background(), moduleID, orgID, req)
	require.NoError(t, err)
	assert.Equal(t, "Introduction", result.Title)
	assert.Equal(t, "text", result.Type)
	assert.Equal(t, moduleID.String(), result.ModuleID)
}

func TestLessonUseCase_CreateLesson_ModuleNotFound(t *testing.T) {
	lessonRepo := new(mocks.MockLessonRepository)
	moduleRepo := new(mocks.MockModuleRepository)
	uc := NewLessonUseCase(lessonRepo, moduleRepo)

	orgID := uuid.New()
	moduleID := uuid.New()
	moduleRepo.On("FindByID", mock.Anything, moduleID, orgID).Return(nil, apperrors.NotFoundError("module", moduleID.String()))

	_, err := uc.CreateLesson(context.Background(), moduleID, orgID, dto.CreateLessonRequest{Title: "Lesson", Type: "text"})
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusNotFound, appErr.HTTPStatus)
}

func TestLessonUseCase_GetLesson_Success(t *testing.T) {
	lessonRepo := new(mocks.MockLessonRepository)
	moduleRepo := new(mocks.MockModuleRepository)
	uc := NewLessonUseCase(lessonRepo, moduleRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	lesson := &entities.Lesson{ID: lessonID, OrgID: orgID, Title: "Intro", Type: "video"}
	lessonRepo.On("FindByID", mock.Anything, lessonID, orgID).Return(lesson, nil)

	result, err := uc.GetLesson(context.Background(), lessonID, orgID)
	require.NoError(t, err)
	assert.Equal(t, "Intro", result.Title)
	assert.Equal(t, "video", result.Type)
}

func TestLessonUseCase_ListLessons_Success(t *testing.T) {
	lessonRepo := new(mocks.MockLessonRepository)
	moduleRepo := new(mocks.MockModuleRepository)
	uc := NewLessonUseCase(lessonRepo, moduleRepo)

	orgID := uuid.New()
	moduleID := uuid.New()
	lessons := []entities.Lesson{
		{ID: uuid.New(), ModuleID: moduleID, OrgID: orgID, Title: "L1", Type: "text", Position: 1},
		{ID: uuid.New(), ModuleID: moduleID, OrgID: orgID, Title: "L2", Type: "video", Position: 2},
	}
	lessonRepo.On("FindByModule", mock.Anything, moduleID, orgID).Return(lessons, nil)

	result, err := uc.ListLessons(context.Background(), moduleID, orgID)
	require.NoError(t, err)
	assert.Len(t, result, 2)
}

func TestLessonUseCase_UpdateLesson_Success(t *testing.T) {
	lessonRepo := new(mocks.MockLessonRepository)
	moduleRepo := new(mocks.MockModuleRepository)
	uc := NewLessonUseCase(lessonRepo, moduleRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	lesson := &entities.Lesson{
		ID: lessonID, OrgID: orgID, Title: "Old Title", Content: "Old Content",
		Type: "text", Position: 1, CreatedAt: time.Now(), UpdatedAt: time.Now(),
	}
	lessonRepo.On("FindByID", mock.Anything, lessonID, orgID).Return(lesson, nil)
	lessonRepo.On("Update", mock.Anything, mock.AnythingOfType("*entities.Lesson")).Return(nil)

	result, err := uc.UpdateLesson(context.Background(), lessonID, orgID, dto.UpdateLessonRequest{Title: "New Title"})
	require.NoError(t, err)
	assert.Equal(t, "New Title", result.Title)
	assert.Equal(t, "Old Content", result.Content) // unchanged
}

func TestLessonUseCase_DeleteLesson_Success(t *testing.T) {
	lessonRepo := new(mocks.MockLessonRepository)
	moduleRepo := new(mocks.MockModuleRepository)
	uc := NewLessonUseCase(lessonRepo, moduleRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	lessonRepo.On("Delete", mock.Anything, lessonID, orgID).Return(nil)

	err := uc.DeleteLesson(context.Background(), lessonID, orgID)
	require.NoError(t, err)
}
