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
