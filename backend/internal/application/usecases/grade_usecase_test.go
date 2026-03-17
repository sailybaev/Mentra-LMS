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

func TestGradeUseCase_GetMyGrades_Success_CalculatesPercentage(t *testing.T) {
	assignmentRepo := new(mocks.MockAssignmentRepository)
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := NewGradeUseCase(assignmentRepo, attemptRepo, quizRepo, memberRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	studentID := uuid.New()
	a1ID := uuid.New()
	a2ID := uuid.New()

	assignments := []*entities.Assignment{
		{ID: a1ID, OrgID: orgID, CourseID: courseID, Title: "HW1", MaxPoints: 100},
		{ID: a2ID, OrgID: orgID, CourseID: courseID, Title: "HW2", MaxPoints: 50},
	}
	sub1 := &entities.AssignmentSubmission{ID: uuid.New(), AssignmentID: a1ID, StudentID: studentID, Score: ptrInt(80)}
	sub2 := &entities.AssignmentSubmission{ID: uuid.New(), AssignmentID: a2ID, StudentID: studentID, Score: ptrInt(40)}

	assignmentRepo.On("FindByCourse", mock.Anything, courseID, orgID).Return(assignments, nil)
	assignmentRepo.On("FindSubmission", mock.Anything, a1ID, studentID).Return(sub1, nil)
	assignmentRepo.On("FindSubmission", mock.Anything, a2ID, studentID).Return(sub2, nil)

	result, err := uc.GetMyGrades(context.Background(), courseID, studentID, orgID)
	require.NoError(t, err)
	assert.Equal(t, studentID.String(), result.StudentID)
	assert.Equal(t, 120, result.TotalEarned)
	assert.Equal(t, 150, result.TotalPossible)
	assert.InDelta(t, 80.0, result.Percentage, 0.01)
}

func TestGradeUseCase_GetMyGrades_NoSubmissions_ZeroPercentage(t *testing.T) {
	assignmentRepo := new(mocks.MockAssignmentRepository)
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := NewGradeUseCase(assignmentRepo, attemptRepo, quizRepo, memberRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	studentID := uuid.New()
	a1ID := uuid.New()

	assignments := []*entities.Assignment{
		{ID: a1ID, OrgID: orgID, CourseID: courseID, Title: "HW1", MaxPoints: 100},
	}

	assignmentRepo.On("FindByCourse", mock.Anything, courseID, orgID).Return(assignments, nil)
	assignmentRepo.On("FindSubmission", mock.Anything, a1ID, studentID).Return(nil, apperrors.NotFoundError("submission", ""))

	result, err := uc.GetMyGrades(context.Background(), courseID, studentID, orgID)
	require.NoError(t, err)
	assert.Equal(t, 0, result.TotalEarned)
	assert.Equal(t, 100, result.TotalPossible)
	assert.Equal(t, 0.0, result.Percentage)
}

func TestGradeUseCase_GetUpcomingDeadlines_MarkSubmittedStatus(t *testing.T) {
	assignmentRepo := new(mocks.MockAssignmentRepository)
	attemptRepo := new(mocks.MockQuizAttemptRepository)
	quizRepo := new(mocks.MockQuizRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := NewGradeUseCase(assignmentRepo, attemptRepo, quizRepo, memberRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	studentID := uuid.New()
	a1ID := uuid.New()
	a2ID := uuid.New()

	futureDate := time.Now().Add(48 * time.Hour)
	assignments := []*entities.Assignment{
		{ID: a1ID, OrgID: orgID, CourseID: courseID, Title: "HW1", DueDate: &futureDate},
		{ID: a2ID, OrgID: orgID, CourseID: courseID, Title: "HW2", DueDate: &futureDate},
	}
	sub := &entities.AssignmentSubmission{ID: uuid.New(), AssignmentID: a1ID, StudentID: studentID}

	assignmentRepo.On("FindByCourse", mock.Anything, courseID, orgID).Return(assignments, nil)
	assignmentRepo.On("FindSubmission", mock.Anything, a1ID, studentID).Return(sub, nil)
	assignmentRepo.On("FindSubmission", mock.Anything, a2ID, studentID).Return(nil, apperrors.NotFoundError("submission", ""))

	deadlines, err := uc.GetUpcomingDeadlines(context.Background(), courseID, studentID, orgID)
	require.NoError(t, err)
	require.Len(t, deadlines, 2)

	// Find which is which
	var hw1, hw2 *struct {
		Submitted bool
	}
	for i := range deadlines {
		if deadlines[i].Title == "HW1" {
			hw1 = &struct{ Submitted bool }{deadlines[i].Submitted}
		} else {
			hw2 = &struct{ Submitted bool }{deadlines[i].Submitted}
		}
	}
	require.NotNil(t, hw1)
	require.NotNil(t, hw2)
	assert.True(t, hw1.Submitted)
	assert.False(t, hw2.Submitted)
}
