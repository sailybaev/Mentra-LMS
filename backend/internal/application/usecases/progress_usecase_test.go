package usecases

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/mocks"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func TestProgressUseCase_CompleteLesson_Success_NewProgress(t *testing.T) {
	progressRepo := new(mocks.MockLessonProgressRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	uc := NewProgressUseCase(progressRepo, lessonRepo, aiService)

	orgID := uuid.New()
	userID := uuid.New()
	lessonID := uuid.New()

	lesson := &entities.Lesson{ID: lessonID, OrgID: orgID}
	lessonRepo.On("FindByID", mock.Anything, lessonID, orgID).Return(lesson, nil)
	progressRepo.On("FindByUserAndLesson", mock.Anything, userID, lessonID, orgID).Return(nil, apperrors.NotFoundError("progress", ""))
	progressRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.LessonProgress")).Return(nil)

	err := uc.CompleteLesson(context.Background(), userID, lessonID, orgID, ptrFloat64(85.5))
	require.NoError(t, err)
	progressRepo.AssertCalled(t, "Create", mock.Anything, mock.AnythingOfType("*entities.LessonProgress"))
}

func TestProgressUseCase_CompleteLesson_Idempotent_UpdatesExisting(t *testing.T) {
	progressRepo := new(mocks.MockLessonProgressRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	uc := NewProgressUseCase(progressRepo, lessonRepo, aiService)

	orgID := uuid.New()
	userID := uuid.New()
	lessonID := uuid.New()

	lesson := &entities.Lesson{ID: lessonID, OrgID: orgID}
	existing := &entities.LessonProgress{
		ID:       uuid.New(),
		UserID:   userID,
		LessonID: lessonID,
		OrgID:    orgID,
	}

	lessonRepo.On("FindByID", mock.Anything, lessonID, orgID).Return(lesson, nil)
	progressRepo.On("FindByUserAndLesson", mock.Anything, userID, lessonID, orgID).Return(existing, nil)
	progressRepo.On("Update", mock.Anything, mock.AnythingOfType("*entities.LessonProgress")).Return(nil)

	err := uc.CompleteLesson(context.Background(), userID, lessonID, orgID, ptrFloat64(90.0))
	require.NoError(t, err)
	progressRepo.AssertCalled(t, "Update", mock.Anything, mock.AnythingOfType("*entities.LessonProgress"))
	progressRepo.AssertNotCalled(t, "Create", mock.Anything, mock.Anything)
}

func TestProgressUseCase_GetProgressInsights_Success(t *testing.T) {
	progressRepo := new(mocks.MockLessonProgressRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	uc := NewProgressUseCase(progressRepo, lessonRepo, aiService)

	orgID := uuid.New()
	userID := uuid.New()

	now := time.Now()
	progresses := []entities.LessonProgress{
		{ID: uuid.New(), UserID: userID, LessonID: uuid.New(), OrgID: orgID, CompletedAt: &now, Score: ptrFloat64(80)},
		{ID: uuid.New(), UserID: userID, LessonID: uuid.New(), OrgID: orgID, CompletedAt: &now, Score: ptrFloat64(90)},
	}

	progressRepo.On("FindByUser", mock.Anything, userID, orgID).Return(progresses, nil)
	aiService.On("GenerateProgressInsights", mock.Anything, progresses).Return("Great progress!", nil)

	result, err := uc.GetProgressInsights(context.Background(), userID, orgID)
	require.NoError(t, err)
	assert.Equal(t, "Great progress!", result.Insights)
	assert.Equal(t, 2, result.TotalLessons)
	assert.Equal(t, 2, result.CompletedLessons)
	assert.Equal(t, 85.0, result.AverageScore)
}

func TestProgressUseCase_GetProgressInsights_AIFails_FallbackMessage(t *testing.T) {
	progressRepo := new(mocks.MockLessonProgressRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	uc := NewProgressUseCase(progressRepo, lessonRepo, aiService)

	orgID := uuid.New()
	userID := uuid.New()

	now := time.Now()
	progresses := []entities.LessonProgress{
		{ID: uuid.New(), UserID: userID, LessonID: uuid.New(), OrgID: orgID, CompletedAt: &now},
	}

	progressRepo.On("FindByUser", mock.Anything, userID, orgID).Return(progresses, nil)
	aiService.On("GenerateProgressInsights", mock.Anything, progresses).Return("", errors.New("AI service unavailable"))

	result, err := uc.GetProgressInsights(context.Background(), userID, orgID)
	require.NoError(t, err)
	assert.Equal(t, "Unable to generate insights at this time.", result.Insights)
}

func TestProgressUseCase_GetProgressInsights_NoProgress_ReturnsNotFound(t *testing.T) {
	progressRepo := new(mocks.MockLessonProgressRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	uc := NewProgressUseCase(progressRepo, lessonRepo, aiService)

	orgID := uuid.New()
	userID := uuid.New()

	progressRepo.On("FindByUser", mock.Anything, userID, orgID).Return([]entities.LessonProgress{}, nil)

	_, err := uc.GetProgressInsights(context.Background(), userID, orgID)
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, 404, appErr.HTTPStatus)
}
