package usecases

import (
	"context"
	"net/http"
	"testing"
	"time"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/mocks"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func TestAnnouncementUseCase_CreateAnnouncement_Success(t *testing.T) {
	announcementRepo := new(mocks.MockAnnouncementRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewAnnouncementUseCase(announcementRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	authorID := uuid.New()
	course := &entities.Course{ID: courseID, OrgID: orgID}

	courseRepo.On("FindByID", mock.Anything, courseID, orgID).Return(course, nil)
	announcementRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.Announcement")).Return(nil)

	req := dto.CreateAnnouncementRequest{Title: "Important Notice", Content: "Please read carefully."}
	result, err := uc.CreateAnnouncement(context.Background(), courseID, orgID, authorID, req)
	require.NoError(t, err)
	assert.Equal(t, "Important Notice", result.Title)
	assert.Equal(t, "Please read carefully.", result.Content)
	assert.Equal(t, courseID.String(), result.CourseID)
	assert.Equal(t, authorID.String(), result.AuthorID)
}

func TestAnnouncementUseCase_CreateAnnouncement_CourseNotFound(t *testing.T) {
	announcementRepo := new(mocks.MockAnnouncementRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewAnnouncementUseCase(announcementRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	courseRepo.On("FindByID", mock.Anything, courseID, orgID).Return(nil, apperrors.NotFoundError("course", courseID.String()))

	_, err := uc.CreateAnnouncement(context.Background(), courseID, orgID, uuid.New(), dto.CreateAnnouncementRequest{Title: "Notice"})
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusNotFound, appErr.HTTPStatus)
}

func TestAnnouncementUseCase_ListAnnouncements_Success(t *testing.T) {
	announcementRepo := new(mocks.MockAnnouncementRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewAnnouncementUseCase(announcementRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	now := time.Now()
	announcements := []entities.Announcement{
		{ID: uuid.New(), CourseID: courseID, OrgID: orgID, Title: "Notice 1", Content: "Content 1", CreatedAt: now, UpdatedAt: now},
		{ID: uuid.New(), CourseID: courseID, OrgID: orgID, Title: "Notice 2", Content: "Content 2", CreatedAt: now, UpdatedAt: now},
	}

	// page=1, pageSize=10 => offset=0
	announcementRepo.On("ListByCourse", mock.Anything, orgID, courseID, 10, 0).Return(announcements, int64(2), nil)

	result, total, err := uc.ListAnnouncements(context.Background(), courseID, orgID, 1, 10)
	require.NoError(t, err)
	assert.Len(t, result, 2)
	assert.Equal(t, int64(2), total)
	assert.Equal(t, "Notice 1", result[0].Title)
}

func TestAnnouncementUseCase_DeleteAnnouncement_Success(t *testing.T) {
	announcementRepo := new(mocks.MockAnnouncementRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewAnnouncementUseCase(announcementRepo, courseRepo)

	orgID := uuid.New()
	announcementID := uuid.New()
	announcementRepo.On("Delete", mock.Anything, announcementID, orgID).Return(nil)

	err := uc.DeleteAnnouncement(context.Background(), announcementID, orgID)
	require.NoError(t, err)
}
