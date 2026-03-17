package entities

import (
	"time"

	"github.com/google/uuid"
)

type Membership struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	OrgID     uuid.UUID
	Role      Role
	CreatedAt time.Time
	UpdatedAt time.Time
}
