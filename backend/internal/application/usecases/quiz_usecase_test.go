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

func makeCreateQuizReq() dto.CreateQuizRequest {
	return dto.CreateQuizRequest{
		Title: "Pop Quiz",
		Questions: []dto.CreateQuestionRequest{
			{
				Question: "What is Go?",
				Position: 1,
				Answers: []dto.CreateAnswerRequest{
					{Answer: "A language", IsCorrect: true},
					{Answer: "A game", IsCorrect: false},
				},
			},
		},
	}
}

func TestQuizUseCase_CreateQuiz_Success(t *testing.T) {
	quizRepo := new(mocks.MockQuizRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	uc := NewQuizUseCase(quizRepo, lessonRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	lesson := &entities.Lesson{ID: lessonID, OrgID: orgID}

	lessonRepo.On("FindByID", mock.Anything, lessonID, orgID).Return(lesson, nil)
	quizRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.Quiz")).Return(nil)

	result, err := uc.CreateQuiz(context.Background(), lessonID, orgID, makeCreateQuizReq())
	require.NoError(t, err)
	assert.Equal(t, "Pop Quiz", result.Title)
	assert.Len(t, result.Questions, 1)
	assert.Len(t, result.Questions[0].Answers, 2)
}

func TestQuizUseCase_CreateQuiz_LessonNotFound(t *testing.T) {
	quizRepo := new(mocks.MockQuizRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	uc := NewQuizUseCase(quizRepo, lessonRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	lessonRepo.On("FindByID", mock.Anything, lessonID, orgID).Return(nil, apperrors.NotFoundError("lesson", lessonID.String()))

	_, err := uc.CreateQuiz(context.Background(), lessonID, orgID, makeCreateQuizReq())
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusNotFound, appErr.HTTPStatus)
}

func TestQuizUseCase_GetQuiz_Success(t *testing.T) {
	quizRepo := new(mocks.MockQuizRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	uc := NewQuizUseCase(quizRepo, lessonRepo)

	orgID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, uuid.New())
	quizRepo.On("FindByID", mock.Anything, quiz.ID, orgID).Return(quiz, nil)

	result, err := uc.GetQuiz(context.Background(), quiz.ID, orgID)
	require.NoError(t, err)
	assert.Equal(t, quiz.ID.String(), result.ID)
	assert.Equal(t, "Test Quiz", result.Title)
}

func TestQuizUseCase_GetQuizByLesson_Success(t *testing.T) {
	quizRepo := new(mocks.MockQuizRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	uc := NewQuizUseCase(quizRepo, lessonRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, lessonID)
	quizRepo.On("FindByLesson", mock.Anything, lessonID, orgID).Return(quiz, nil)

	result, err := uc.GetQuizByLesson(context.Background(), lessonID, orgID)
	require.NoError(t, err)
	assert.Equal(t, quiz.ID.String(), result.ID)
}

func TestQuizUseCase_UpdateQuiz_Success(t *testing.T) {
	quizRepo := new(mocks.MockQuizRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	uc := NewQuizUseCase(quizRepo, lessonRepo)

	orgID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, uuid.New())
	quiz.CreatedAt = time.Now()
	quiz.UpdatedAt = time.Now()
	quizRepo.On("FindByID", mock.Anything, quiz.ID, orgID).Return(quiz, nil)
	quizRepo.On("Update", mock.Anything, mock.AnythingOfType("*entities.Quiz")).Return(nil)

	req := dto.UpdateQuizRequest{
		Title: "Updated Quiz",
		Questions: []dto.CreateQuestionRequest{
			{
				Question: "New Q?",
				Position: 1,
				Answers: []dto.CreateAnswerRequest{
					{Answer: "Yes", IsCorrect: true},
					{Answer: "No", IsCorrect: false},
				},
			},
		},
	}
	result, err := uc.UpdateQuiz(context.Background(), quiz.ID, orgID, req)
	require.NoError(t, err)
	assert.Equal(t, "Updated Quiz", result.Title)
	assert.Len(t, result.Questions, 1)
	assert.Equal(t, "New Q?", result.Questions[0].Question)
}

func TestQuizUseCase_DeleteQuiz_Success(t *testing.T) {
	quizRepo := new(mocks.MockQuizRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	uc := NewQuizUseCase(quizRepo, lessonRepo)

	orgID := uuid.New()
	quizID := uuid.New()
	quizRepo.On("Delete", mock.Anything, quizID, orgID).Return(nil)

	err := uc.DeleteQuiz(context.Background(), quizID, orgID)
	require.NoError(t, err)
}
