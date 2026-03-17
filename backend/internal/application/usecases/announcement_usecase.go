package usecases

import (
	"context"
	"time"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/domain/repositories"
	"github.com/google/uuid"
)

type AnnouncementUseCase struct {
	announcementRepo repositories.AnnouncementRepository
	courseRepo       repositories.CourseRepository
}

func NewAnnouncementUseCase(announcementRepo repositories.AnnouncementRepository, courseRepo repositories.CourseRepository) *AnnouncementUseCase {
	return &AnnouncementUseCase{announcementRepo: announcementRepo, courseRepo: courseRepo}
}

func (uc *AnnouncementUseCase) CreateAnnouncement(ctx context.Context, courseID, orgID, authorID uuid.UUID, req dto.CreateAnnouncementRequest) (*dto.AnnouncementDTO, error) {
	if _, err := uc.courseRepo.FindByID(ctx, courseID, orgID); err != nil {
		return nil, err
	}
	now := time.Now()
	a := &entities.Announcement{
		ID:        uuid.New(),
		CourseID:  courseID,
		OrgID:     orgID,
		AuthorID:  authorID,
		Title:     req.Title,
		Content:   req.Content,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := uc.announcementRepo.Create(ctx, a); err != nil {
		return nil, err
	}
	return toAnnouncementDTO(a), nil
}

func (uc *AnnouncementUseCase) ListAnnouncements(ctx context.Context, courseID, orgID uuid.UUID, page, pageSize int) ([]dto.AnnouncementDTO, int64, error) {
	offset := (page - 1) * pageSize
	announcements, total, err := uc.announcementRepo.ListByCourse(ctx, orgID, courseID, pageSize, offset)
	if err != nil {
		return nil, 0, err
	}
	result := make([]dto.AnnouncementDTO, len(announcements))
	for i, a := range announcements {
		result[i] = *toAnnouncementDTO(&a)
	}
	return result, total, nil
}

func (uc *AnnouncementUseCase) DeleteAnnouncement(ctx context.Context, id, orgID uuid.UUID) error {
	return uc.announcementRepo.Delete(ctx, id, orgID)
}

func toAnnouncementDTO(a *entities.Announcement) *dto.AnnouncementDTO {
	return &dto.AnnouncementDTO{
		ID:        a.ID.String(),
		CourseID:  a.CourseID.String(),
		OrgID:     a.OrgID.String(),
		AuthorID:  a.AuthorID.String(),
		Title:     a.Title,
		Content:   a.Content,
		CreatedAt: a.CreatedAt,
		UpdatedAt: a.UpdatedAt,
	}
}
