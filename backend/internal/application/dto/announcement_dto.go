package dto

import "time"

type CreateAnnouncementRequest struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

type AnnouncementDTO struct {
	ID        string    `json:"id"`
	CourseID  string    `json:"course_id"`
	OrgID     string    `json:"org_id"`
	AuthorID  string    `json:"author_id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
