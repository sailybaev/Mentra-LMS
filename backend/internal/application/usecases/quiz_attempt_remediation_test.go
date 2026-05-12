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

func newRemediationUC(
	attemptRepo *mocks.MockQuizAttemptRepository,
	quizRepo *mocks.MockQuizRepository,
	lessonRepo *mocks.MockLessonRepository,
	aiService *mocks.MockAIService,
) *QuizAttemptUseCase {
	return NewQuizAttemptUseCase(attemptRepo, quizRepo, lessonRepo, aiService)
}

func TestQuizAttemptUseCase_GetRemediation_WithWrongAnswers(t *testing.T) {
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	uc := newRemediationUC(attemptRepo, quizRepo, lessonRepo, aiService)

	orgID := uuid.New()
	lessonID := uuid.New()
	studentID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, lessonID)

	wrongAnswerID := quiz.Questions[0].Answers[1].ID // IsCorrect = false
	attempt := &entities.QuizAttempt{
		ID:        uuid.New(),
		QuizID:    quiz.ID,
		StudentID: studentID,
		OrgID:     orgID,
		Score:     0,
		MaxScore:  1,
		Answers: []entities.QuizAttemptAnswer{
			{QuestionID: quiz.Questions[0].ID.String(), AnswerID: wrongAnswerID.String()},
		},
		SubmittedAt: time.Now(),
	}
	lesson := &entities.Lesson{ID: lessonID, OrgID: orgID, Title: "Test Lesson", Content: "Lesson content here"}

	attemptRepo.On("FindByQuizAndStudent", mock.Anything, quiz.ID, studentID).Return(attempt, nil)
	quizRepo.On("FindByID", mock.Anything, quiz.ID, orgID).Return(quiz, nil)
	lessonRepo.On("FindByID", mock.Anything, lessonID, orgID).Return(lesson, nil)
	aiService.On("GenerateRemediation", mock.Anything, lesson.Content, []string{quiz.Questions[0].Question}).
		Return("Review the section on correct answers.", nil)

	result, err := uc.GetRemediation(context.Background(), quiz.ID, studentID, orgID)
	require.NoError(t, err)
	assert.Equal(t, quiz.ID.String(), result.QuizID)
	assert.Equal(t, lesson.Title, result.LessonTitle)
	assert.Equal(t, 0, result.Score)
	assert.Equal(t, 1, result.MaxScore)
	assert.Equal(t, 0.0, result.Percentage)
	assert.Equal(t, "Review the section on correct answers.", result.Remediation)
	assert.Equal(t, []string{quiz.Questions[0].Question}, result.WeakTopics)
}

func TestQuizAttemptUseCase_GetRemediation_AllCorrect_NoAICall(t *testing.T) {
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	uc := newRemediationUC(attemptRepo, quizRepo, lessonRepo, aiService)

	orgID := uuid.New()
	lessonID := uuid.New()
	studentID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, lessonID)

	correctAnswerID := quiz.Questions[0].Answers[0].ID // IsCorrect = true
	attempt := &entities.QuizAttempt{
		ID:        uuid.New(),
		QuizID:    quiz.ID,
		StudentID: studentID,
		OrgID:     orgID,
		Score:     1,
		MaxScore:  1,
		Answers: []entities.QuizAttemptAnswer{
			{QuestionID: quiz.Questions[0].ID.String(), AnswerID: correctAnswerID.String()},
		},
		SubmittedAt: time.Now(),
	}
	lesson := &entities.Lesson{ID: lessonID, OrgID: orgID, Title: "Test Lesson", Content: "Lesson content"}

	attemptRepo.On("FindByQuizAndStudent", mock.Anything, quiz.ID, studentID).Return(attempt, nil)
	quizRepo.On("FindByID", mock.Anything, quiz.ID, orgID).Return(quiz, nil)
	lessonRepo.On("FindByID", mock.Anything, lessonID, orgID).Return(lesson, nil)

	result, err := uc.GetRemediation(context.Background(), quiz.ID, studentID, orgID)
	require.NoError(t, err)
	assert.Equal(t, 100.0, result.Percentage)
	assert.Contains(t, result.Remediation, "correctly")
	assert.Empty(t, result.WeakTopics)
	aiService.AssertNotCalled(t, "GenerateRemediation")
}

func TestQuizAttemptUseCase_GetRemediation_AIFails_FallbackMessage(t *testing.T) {
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	uc := newRemediationUC(attemptRepo, quizRepo, lessonRepo, aiService)

	orgID := uuid.New()
	lessonID := uuid.New()
	studentID := uuid.New()
	quiz := makeQuizWithQuestions(orgID, lessonID)

	wrongAnswerID := quiz.Questions[0].Answers[1].ID
	attempt := &entities.QuizAttempt{
		ID:        uuid.New(),
		QuizID:    quiz.ID,
		StudentID: studentID,
		OrgID:     orgID,
		Score:     0,
		MaxScore:  1,
		Answers: []entities.QuizAttemptAnswer{
			{QuestionID: quiz.Questions[0].ID.String(), AnswerID: wrongAnswerID.String()},
		},
		SubmittedAt: time.Now(),
	}
	lesson := &entities.Lesson{ID: lessonID, OrgID: orgID, Title: "Test Lesson", Content: "Lesson content"}

	attemptRepo.On("FindByQuizAndStudent", mock.Anything, quiz.ID, studentID).Return(attempt, nil)
	quizRepo.On("FindByID", mock.Anything, quiz.ID, orgID).Return(quiz, nil)
	lessonRepo.On("FindByID", mock.Anything, lessonID, orgID).Return(lesson, nil)
	aiService.On("GenerateRemediation", mock.Anything, lesson.Content, mock.Anything).
		Return("", errors.New("AI unavailable"))

	result, err := uc.GetRemediation(context.Background(), quiz.ID, studentID, orgID)
	require.NoError(t, err)
	assert.Contains(t, result.Remediation, "Review the lesson")
	assert.NotEmpty(t, result.WeakTopics)
}

func TestQuizAttemptUseCase_GetRemediation_NoAttempt_ReturnsError(t *testing.T) {
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	lessonRepo := new(mocks.MockLessonRepository)
	aiService := new(mocks.MockAIService)
	uc := newRemediationUC(attemptRepo, quizRepo, lessonRepo, aiService)

	quizID := uuid.New()
	studentID := uuid.New()
	orgID := uuid.New()

	attemptRepo.On("FindByQuizAndStudent", mock.Anything, quizID, studentID).
		Return(nil, apperrors.NotFoundError("quiz attempt", quizID.String()))

	_, err := uc.GetRemediation(context.Background(), quizID, studentID, orgID)
	require.Error(t, err)
}
