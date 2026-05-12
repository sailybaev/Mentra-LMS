package dto

type SummarizeLessonRequest struct {
	LessonID string `json:"lesson_id" binding:"required"`
}

type SummarizeLessonResponse struct {
	Summary string `json:"summary"`
}

type GenerateQuizRequest struct {
	LessonID     string `json:"lesson_id" binding:"required"`
	NumQuestions int    `json:"num_questions" binding:"required,min=1,max=20"`
}

type GenerateFlashcardsRequest struct {
	LessonID string `json:"lesson_id" binding:"required"`
	NumCards int    `json:"num_cards" binding:"required,min=1,max=30"`
}

type FlashcardDTO struct {
	Term       string `json:"term"`
	Definition string `json:"definition"`
}

type AssignmentFeedbackRequest struct {
	SubmissionID string `json:"submission_id" binding:"required"`
}

type AssignmentFeedbackResponse struct {
	Strengths    []string `json:"strengths"`
	Gaps         []string `json:"gaps"`
	Improvements []string `json:"improvements"`
	Overall      string   `json:"overall"`
}
