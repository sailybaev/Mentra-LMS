package dto

import "time"

type CreateQuizRequest struct {
	Title     string                  `json:"title" binding:"required"`
	Questions []CreateQuestionRequest `json:"questions" binding:"required,min=1"`
}

type UpdateQuizRequest struct {
	Title     string                  `json:"title"`
	Questions []CreateQuestionRequest `json:"questions" binding:"required,min=1"`
}

type CreateQuestionRequest struct {
	Question string               `json:"question" binding:"required"`
	Position int                  `json:"position"`
	Answers  []CreateAnswerRequest `json:"answers" binding:"required,min=2"`
}

type CreateAnswerRequest struct {
	Answer    string `json:"answer" binding:"required"`
	IsCorrect bool   `json:"is_correct"`
}

type QuizDTO struct {
	ID        string        `json:"id"`
	LessonID  string        `json:"lesson_id"`
	OrgID     string        `json:"org_id"`
	Title     string        `json:"title"`
	Questions []QuestionDTO `json:"questions"`
	CreatedAt time.Time     `json:"created_at"`
	UpdatedAt time.Time     `json:"updated_at"`
}

type QuestionDTO struct {
	ID       string      `json:"id"`
	Question string      `json:"question"`
	Position int         `json:"position"`
	Answers  []AnswerDTO `json:"answers"`
}

type AnswerDTO struct {
	ID        string `json:"id"`
	Answer    string `json:"answer"`
	IsCorrect bool   `json:"is_correct"`
}
