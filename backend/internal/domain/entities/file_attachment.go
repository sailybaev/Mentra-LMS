package entities

import (
	"time"

	"github.com/google/uuid"
)

type FileAttachment struct {
	ID           uuid.UUID
	OrgID        uuid.UUID
	UploaderID   uuid.UUID
	OriginalName string
	StoredPath   string
	MimeType     string
	SizeBytes    int64
	RefType      string
	RefID        uuid.UUID
	CreatedAt    time.Time
}
