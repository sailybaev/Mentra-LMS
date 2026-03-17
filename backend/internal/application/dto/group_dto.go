package dto

import "time"

type CreateGroupRequest struct {
	Name      string  `json:"name" binding:"required"`
	TeacherID *string `json:"teacher_id"`
}

type UpdateGroupRequest struct {
	Name      string  `json:"name"`
	TeacherID *string `json:"teacher_id"`
}

type GroupDTO struct {
	ID        string    `json:"id"`
	CourseID  *string   `json:"course_id,omitempty"`
	OrgID     string    `json:"org_id"`
	TeacherID *string   `json:"teacher_id,omitempty"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type AssignCourseRequest struct {
	CourseID string `json:"course_id" binding:"required,uuid"`
}

type CreateGroupScheduleRequest struct {
	DayOfWeek int    `json:"day_of_week" binding:"min=0,max=6"`
	StartTime string `json:"start_time" binding:"required"`
	EndTime   string `json:"end_time" binding:"required"`
	Location  string `json:"location"`
}

type GroupScheduleDTO struct {
	ID        string    `json:"id"`
	GroupID   string    `json:"group_id"`
	DayOfWeek int       `json:"day_of_week"`
	StartTime string    `json:"start_time"`
	EndTime   string    `json:"end_time"`
	Location  string    `json:"location"`
	CreatedAt time.Time `json:"created_at"`
}

type AddMemberRequest struct {
	StudentID string `json:"student_id" binding:"required"`
}

type GroupMemberDTO struct {
	ID        string    `json:"id"`
	GroupID   string    `json:"group_id"`
	StudentID string    `json:"student_id"`
	OrgID     string    `json:"org_id"`
	JoinedAt  time.Time `json:"joined_at"`
}
