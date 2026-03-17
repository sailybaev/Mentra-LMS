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

func TestQuizAttemptUseCase_Submit_Success_AutoGrades(t *testing.T) {
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	uc := NewQuizAttemptUseCase(attemptRepo, quizRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, lessonID)
	studentID := uuid.New()

	correctAnswerID := quiz.Questions[0].Answers[0].ID.String()
	questionID := quiz.Questions[0].ID.String()

	quizRepo.On("FindByID", mock.Anything, quiz.ID, orgID).Return(quiz, nil)
	attemptRepo.On("FindByQuizAndStudent", mock.Anything, quiz.ID, studentID).Return(nil, apperrors.NotFoundError("attempt", ""))
	attemptRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.QuizAttempt")).Return(nil)

	result, err := uc.Submit(context.Background(), quiz.ID, studentID, orgID, []dto.QuizAnswerInput{
		{QuestionID: questionID, AnswerID: correctAnswerID},
	})
	require.NoError(t, err)
	assert.Equal(t, 1, result.Score)
	assert.Equal(t, 1, result.MaxScore)
	assert.Equal(t, 100.0, result.Percentage)
}

func TestQuizAttemptUseCase_Submit_AllCorrect(t *testing.T) {
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	uc := NewQuizAttemptUseCase(attemptRepo, quizRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, lessonID)
	studentID := uuid.New()

	correctAnswerID := quiz.Questions[0].Answers[0].ID.String()
	questionID := quiz.Questions[0].ID.String()

	quizRepo.On("FindByID", mock.Anything, quiz.ID, orgID).Return(quiz, nil)
	attemptRepo.On("FindByQuizAndStudent", mock.Anything, quiz.ID, studentID).Return(nil, apperrors.NotFoundError("attempt", ""))
	attemptRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.QuizAttempt")).Return(nil)

	result, err := uc.Submit(context.Background(), quiz.ID, studentID, orgID, []dto.QuizAnswerInput{
		{QuestionID: questionID, AnswerID: correctAnswerID},
	})
	require.NoError(t, err)
	assert.Equal(t, result.MaxScore, result.Score)
}

func TestQuizAttemptUseCase_Submit_NoneCorrect(t *testing.T) {
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	uc := NewQuizAttemptUseCase(attemptRepo, quizRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, lessonID)
	studentID := uuid.New()

	wrongAnswerID := quiz.Questions[0].Answers[1].ID.String() // IsCorrect = false
	questionID := quiz.Questions[0].ID.String()

	quizRepo.On("FindByID", mock.Anything, quiz.ID, orgID).Return(quiz, nil)
	attemptRepo.On("FindByQuizAndStudent", mock.Anything, quiz.ID, studentID).Return(nil, apperrors.NotFoundError("attempt", ""))
	attemptRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.QuizAttempt")).Return(nil)

	result, err := uc.Submit(context.Background(), quiz.ID, studentID, orgID, []dto.QuizAnswerInput{
		{QuestionID: questionID, AnswerID: wrongAnswerID},
	})
	require.NoError(t, err)
	assert.Equal(t, 0, result.Score)
	assert.Equal(t, 0.0, result.Percentage)
}

func TestQuizAttemptUseCase_Submit_DeadlinePassed_ReturnsValidation(t *testing.T) {
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	uc := NewQuizAttemptUseCase(attemptRepo, quizRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, lessonID)
	pastDue := time.Now().Add(-24 * time.Hour)
	quiz.DueDate = &pastDue
	quiz.AllowLateSubmission = false
	studentID := uuid.New()

	quizRepo.On("FindByID", mock.Anything, quiz.ID, orgID).Return(quiz, nil)

	_, err := uc.Submit(context.Background(), quiz.ID, studentID, orgID, nil)
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusUnprocessableEntity, appErr.HTTPStatus)
}

func TestQuizAttemptUseCase_Submit_AlreadyAttempted_ReturnsExisting(t *testing.T) {
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	uc := NewQuizAttemptUseCase(attemptRepo, quizRepo)

	orgID := uuid.New()
	lessonID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, lessonID)
	studentID := uuid.New()

	existingAttempt := &entities.QuizAttempt{
		ID:          uuid.New(),
		QuizID:      quiz.ID,
		StudentID:   studentID,
		Score:       1,
		MaxScore:    1,
		SubmittedAt: time.Now().Add(-5 * time.Minute),
	}

	quizRepo.On("FindByID", mock.Anything, quiz.ID, orgID).Return(quiz, nil)
	attemptRepo.On("FindByQuizAndStudent", mock.Anything, quiz.ID, studentID).Return(existingAttempt, nil)

	result, err := uc.Submit(context.Background(), quiz.ID, studentID, orgID, nil)
	require.NoError(t, err)
	assert.Equal(t, existingAttempt.ID.String(), result.ID)
	// Create should NOT be called
	attemptRepo.AssertNotCalled(t, "Create", mock.Anything, mock.Anything)
}
