package dto

import "time"

type InviteMemberRequest struct {
	Name     string `json:"name"     binding:"required"`
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role"     binding:"required,oneof=admin teacher student"`
}

type UpdateMemberRoleRequest struct {
	Role string `json:"role" binding:"required,oneof=admin teacher student"`
}

type MemberDTO struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	OrgID     string    `json:"org_id"`
	Role      string    `json:"role"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	JoinedAt  time.Time `json:"joined_at"`
}

type CSVRowError struct {
	Row   int    `json:"row"`
	Email string `json:"email"`
	Error string `json:"error"`
}

type CSVImportedUser struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	Password string `json:"password,omitempty"`
}

type CSVImportResultDTO struct {
	Imported []CSVImportedUser `json:"imported"`
	Errors   []CSVRowError     `json:"errors"`
}
