package dto

import "time"

type CompleteLessonRequest struct {
	Score *float64 `json:"score"`
}

type ProgressDTO struct {
	ID          string     `json:"id"`
	UserID      string     `json:"user_id"`
	LessonID    string     `json:"lesson_id"`
	OrgID       string     `json:"org_id"`
	CompletedAt *time.Time `json:"completed_at"`
	Score       *float64   `json:"score"`
	CreatedAt   time.Time  `json:"created_at"`
}

type InsightsDTO struct {
	Insights         string  `json:"insights"`
	TotalLessons     int     `json:"total_lessons"`
	CompletedLessons int     `json:"completed_lessons"`
	AverageScore     float64 `json:"average_score"`
}

type ModulePacingDTO struct {
	ModuleID         string  `json:"module_id"`
	ModuleTitle      string  `json:"module_title"`
	TotalLessons     int     `json:"total_lessons"`
	CompletedLessons int     `json:"completed_lessons"`
	CompletionRate   float64 `json:"completion_rate"`
	AverageScore     float64 `json:"average_score"`
	HasQuizzes       bool    `json:"has_quizzes"`
	Pace             string  `json:"pace"` // not_started | struggling | on_track | ahead
}

type CoursePacingDTO struct {
	CourseID    string            `json:"course_id"`
	Modules     []ModulePacingDTO `json:"modules"`
	OverallPace string            `json:"overall_pace"`
}
