package dto

import "time"

type AssignTeacherRequest struct {
	TeacherID string `json:"teacher_id" binding:"required,uuid"`
}

type CourseTeacherDTO struct {
	ID         string    `json:"id"`
	CourseID   string    `json:"course_id"`
	TeacherID  string    `json:"teacher_id"`
	OrgID      string    `json:"org_id"`
	AssignedAt time.Time `json:"assigned_at"`
}
