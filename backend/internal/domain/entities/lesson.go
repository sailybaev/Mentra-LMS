package entities

import (
	"time"

	"github.com/google/uuid"
)

type LessonType string

const (
	LessonVideo LessonType = "video"
	LessonText  LessonType = "text"
	LessonQuiz  LessonType = "quiz"
	LessonPDF   LessonType = "pdf"
	LessonLink  LessonType = "link"
)

type Lesson struct {
	ID        uuid.UUID
	ModuleID  uuid.UUID
	OrgID     uuid.UUID
	Title     string
	Content   string
	Type      LessonType
	VideoURL  string
	LinkURL   string
	FileURL   string
	Position  int
	CreatedAt time.Time
	UpdatedAt time.Time
}
