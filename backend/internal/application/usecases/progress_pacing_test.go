package usecases

import (
	"context"
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

func newPacingUC(
	progressRepo *mocks.MockLessonProgressRepository,
	lessonRepo *mocks.MockLessonRepository,
	aiService *mocks.MockAIService,
	moduleRepo *mocks.MockModuleRepository,
	quizRepo *mocks.MockQuizRepository,
	quizAttemptRepo *mocks.MockQuizAttemptRepository,
) *ProgressUseCase {
	return NewProgressUseCase(progressRepo, lessonRepo, aiService, moduleRepo, quizRepo, quizAttemptRepo)
}

func TestProgressUseCase_GetCoursePacing_AheadWhenAllCompletedHighScore(t *testing.T) {
	progressRepo := new(mocks.MockLessonProgressRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	moduleRepo := new(mocks.MockModuleRepository)
	quizRepo := new(mocks.MockQuizRepository)
	quizAttemptRepo := new(mocks.MockQuizAttemptRepository)
	uc := newPacingUC(progressRepo, lessonRepo, aiService, moduleRepo, quizRepo, quizAttemptRepo)

	courseID := uuid.New()
	orgID := uuid.New()
	userID := uuid.New()
	modID := uuid.New()
	lessonID := uuid.New()
	quizID := uuid.New()

	modules := []entities.Module{{ID: modID, CourseID: courseID, OrgID: orgID, Title: "Module 1"}}
	lessons := []entities.Lesson{{ID: lessonID, ModuleID: modID, OrgID: orgID}}

	now := time.Now()
	progress := []entities.LessonProgress{{ID: uuid.New(), UserID: userID, LessonID: lessonID, OrgID: orgID, CompletedAt: &now}}
	quizzes := []entities.Quiz{{ID: quizID, LessonID: lessonID, OrgID: orgID}}
	attempts := []*entities.QuizAttempt{{ID: uuid.New(), QuizID: quizID, StudentID: userID, OrgID: orgID, Score: 9, MaxScore: 10}}

	moduleRepo.On("FindByCourse", mock.Anything, courseID, orgID).Return(modules, nil)
	lessonRepo.On("FindByModule", mock.Anything, modID, orgID).Return(lessons, nil)
	progressRepo.On("FindByUser", mock.Anything, userID, orgID).Return(progress, nil)
	quizRepo.On("FindByLessons", mock.Anything, []uuid.UUID{lessonID}, orgID).Return(quizzes, nil)
	quizAttemptRepo.On("FindByStudentAndQuizzes", mock.Anything, userID, []uuid.UUID{quizID}).Return(attempts, nil)

	result, err := uc.GetCoursePacing(context.Background(), courseID, userID, orgID)
	require.NoError(t, err)
	assert.Equal(t, "ahead", result.OverallPace)
	require.Len(t, result.Modules, 1)
	assert.Equal(t, "ahead", result.Modules[0].Pace)
	assert.Equal(t, 100.0, result.Modules[0].CompletionRate)
	assert.InDelta(t, 90.0, result.Modules[0].AverageScore, 0.01)
}

func TestProgressUseCase_GetCoursePacing_StrugglingWhenLowQuizScore(t *testing.T) {
	progressRepo := new(mocks.MockLessonProgressRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	moduleRepo := new(mocks.MockModuleRepository)
	quizRepo := new(mocks.MockQuizRepository)
	quizAttemptRepo := new(mocks.MockQuizAttemptRepository)
	uc := newPacingUC(progressRepo, lessonRepo, aiService, moduleRepo, quizRepo, quizAttemptRepo)

	courseID := uuid.New()
	orgID := uuid.New()
	userID := uuid.New()
	modID := uuid.New()
	lessonID := uuid.New()
	quizID := uuid.New()

	modules := []entities.Module{{ID: modID, CourseID: courseID, OrgID: orgID, Title: "Module 1"}}
	lessons := []entities.Lesson{{ID: lessonID, ModuleID: modID, OrgID: orgID}}

	now := time.Now()
	progress := []entities.LessonProgress{{ID: uuid.New(), UserID: userID, LessonID: lessonID, OrgID: orgID, CompletedAt: &now}}
	quizzes := []entities.Quiz{{ID: quizID, LessonID: lessonID, OrgID: orgID}}
	attempts := []*entities.QuizAttempt{{ID: uuid.New(), QuizID: quizID, StudentID: userID, OrgID: orgID, Score: 2, MaxScore: 10}}

	moduleRepo.On("FindByCourse", mock.Anything, courseID, orgID).Return(modules, nil)
	lessonRepo.On("FindByModule", mock.Anything, modID, orgID).Return(lessons, nil)
	progressRepo.On("FindByUser", mock.Anything, userID, orgID).Return(progress, nil)
	quizRepo.On("FindByLessons", mock.Anything, []uuid.UUID{lessonID}, orgID).Return(quizzes, nil)
	quizAttemptRepo.On("FindByStudentAndQuizzes", mock.Anything, userID, []uuid.UUID{quizID}).Return(attempts, nil)

	result, err := uc.GetCoursePacing(context.Background(), courseID, userID, orgID)
	require.NoError(t, err)
	assert.Equal(t, "struggling", result.OverallPace)
	assert.Equal(t, "struggling", result.Modules[0].Pace)
}

func TestProgressUseCase_GetCoursePacing_NotStartedWhenNoProgress(t *testing.T) {
	progressRepo := new(mocks.MockLessonProgressRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	moduleRepo := new(mocks.MockModuleRepository)
	quizRepo := new(mocks.MockQuizRepository)
	quizAttemptRepo := new(mocks.MockQuizAttemptRepository)
	uc := newPacingUC(progressRepo, lessonRepo, aiService, moduleRepo, quizRepo, quizAttemptRepo)

	courseID := uuid.New()
	orgID := uuid.New()
	userID := uuid.New()
	modID := uuid.New()
	lessonID := uuid.New()

	modules := []entities.Module{{ID: modID, CourseID: courseID, OrgID: orgID, Title: "Module 1"}}
	lessons := []entities.Lesson{{ID: lessonID, ModuleID: modID, OrgID: orgID}}

	moduleRepo.On("FindByCourse", mock.Anything, courseID, orgID).Return(modules, nil)
	lessonRepo.On("FindByModule", mock.Anything, modID, orgID).Return(lessons, nil)
	progressRepo.On("FindByUser", mock.Anything, userID, orgID).Return([]entities.LessonProgress{}, nil)
	quizRepo.On("FindByLessons", mock.Anything, []uuid.UUID{lessonID}, orgID).Return(nil, apperrors.NotFoundError("quiz", ""))
	quizAttemptRepo.On("FindByStudentAndQuizzes", mock.Anything, userID, []uuid.UUID{}).Return(nil, nil)

	result, err := uc.GetCoursePacing(context.Background(), courseID, userID, orgID)
	require.NoError(t, err)
	assert.Equal(t, "not_started", result.OverallPace)
	assert.Equal(t, "not_started", result.Modules[0].Pace)
}

func TestProgressUseCase_GetCoursePacing_ModuleRepoError(t *testing.T) {
	progressRepo := new(mocks.MockLessonProgressRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	moduleRepo := new(mocks.MockModuleRepository)
	quizRepo := new(mocks.MockQuizRepository)
	quizAttemptRepo := new(mocks.MockQuizAttemptRepository)
	uc := newPacingUC(progressRepo, lessonRepo, aiService, moduleRepo, quizRepo, quizAttemptRepo)

	courseID := uuid.New()
	orgID := uuid.New()
	userID := uuid.New()

	moduleRepo.On("FindByCourse", mock.Anything, courseID, orgID).Return([]entities.Module{}, apperrors.NotFoundError("course", courseID.String()))

	_, err := uc.GetCoursePacing(context.Background(), courseID, userID, orgID)
	require.Error(t, err)
}
