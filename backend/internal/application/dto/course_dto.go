package dto

import "time"

type CreateCourseRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
}

type UpdateCourseRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type CourseDTO struct {
	ID          string    `json:"id"`
	OrgID       string    `json:"org_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	CreatedBy   string    `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
