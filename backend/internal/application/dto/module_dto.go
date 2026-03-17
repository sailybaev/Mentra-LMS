package dto

import "time"

type CreateModuleRequest struct {
	Title    string `json:"title" binding:"required"`
	Position int    `json:"position"`
}

type UpdateModuleRequest struct {
	Title    string `json:"title"`
	Position int    `json:"position"`
}

type ModuleDTO struct {
	ID        string    `json:"id"`
	CourseID  string    `json:"course_id"`
	OrgID     string    `json:"org_id"`
	Title     string    `json:"title"`
	Position  int       `json:"position"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
