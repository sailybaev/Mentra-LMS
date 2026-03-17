package usecases

import (
	"time"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func ptrTime(t time.Time) *time.Time { return &t }
func ptrInt(i int) *int              { return &i }
func ptrString(s string) *string     { return &s }
func ptrFloat64(f float64) *float64  { return &f }

func makeUser(email, password string, role entities.Role) *entities.User {
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	return &entities.User{
		ID:           uuid.New(),
		Email:        email,
		PasswordHash: string(hash),
		Name:         "Test User",
		Role:         string(role),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
}

func makeExamWithQuestions(orgID, courseID uuid.UUID, mcqEnabled, fileEnabled bool) *entities.Exam {
	q1ID := uuid.New()
	a1ID := uuid.New()
	a2ID := uuid.New()

	var questions []entities.ExamQuestion
	if mcqEnabled {
		questions = []entities.ExamQuestion{
			{
				ID:     q1ID,
				ExamID: uuid.Nil,
				Question: "What is 2+2?",
				Position: 1,
				Answers: []entities.ExamAnswer{
					{ID: a1ID, QuestionID: q1ID, Answer: "4", IsCorrect: true},
					{ID: a2ID, QuestionID: q1ID, Answer: "5", IsCorrect: false},
				},
			},
		}
	}

	return &entities.Exam{
		ID:              uuid.New(),
		CourseID:        courseID,
		OrgID:           orgID,
		Title:           "Test Exam",
		Description:     "A test exam",
		DurationMinutes: 60,
		MaxAttempts:     1,
		MCQEnabled:      mcqEnabled,
		MCQPoints:       100,
		FileEnabled:     fileEnabled,
		FilePoints:      50,
		Questions:       questions,
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	}
}

func makeQuizWithQuestions(orgID, lessonID uuid.UUID) *entities.Quiz {
	q1ID := uuid.New()
	a1ID := uuid.New()
	a2ID := uuid.New()

	return &entities.Quiz{
		ID:       uuid.New(),
		LessonID: lessonID,
		OrgID:    orgID,
		Title:    "Test Quiz",
		MaxPoints: 10,
		Questions: []entities.QuizQuestion{
			{
				ID:       q1ID,
				Question: "Which is correct?",
				Position: 1,
				Answers: []entities.QuizAnswer{
					{ID: a1ID, QuestionID: q1ID, Answer: "Yes", IsCorrect: true},
					{ID: a2ID, QuestionID: q1ID, Answer: "No", IsCorrect: false},
				},
			},
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}
