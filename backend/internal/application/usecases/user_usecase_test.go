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

func TestUserUseCase_GetProfile_Success(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	uc := NewUserUseCase(userRepo)

	userID := uuid.New()
	user := &entities.User{
		ID:        userID,
		Email:     "user@test.com",
		Name:      "Test User",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	userRepo.On("FindByID", mock.Anything, userID).Return(user, nil)

	result, err := uc.GetProfile(context.Background(), userID)
	require.NoError(t, err)
	assert.Equal(t, userID.String(), result.ID)
	assert.Equal(t, "user@test.com", result.Email)
	assert.Equal(t, "Test User", result.Name)
}

func TestUserUseCase_GetProfile_NotFound(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	uc := NewUserUseCase(userRepo)

	userID := uuid.New()
	userRepo.On("FindByID", mock.Anything, userID).Return(nil, apperrors.NotFoundError("user", userID.String()))

	_, err := uc.GetProfile(context.Background(), userID)
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusNotFound, appErr.HTTPStatus)
}

func TestUserUseCase_UpdateProfile_Success(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	uc := NewUserUseCase(userRepo)

	userID := uuid.New()
	user := &entities.User{
		ID:        userID,
		Email:     "user@test.com",
		Name:      "Old Name",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	userRepo.On("FindByID", mock.Anything, userID).Return(user, nil)
	userRepo.On("Update", mock.Anything, mock.AnythingOfType("*entities.User")).Return(nil)

	result, err := uc.UpdateProfile(context.Background(), userID, dto.UpdateProfileRequest{Name: "New Name"})
	require.NoError(t, err)
	assert.Equal(t, "New Name", result.Name)
	assert.Equal(t, "user@test.com", result.Email)
}

func TestUserUseCase_UpdateProfile_EmptyName_ReturnsValidation(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	uc := NewUserUseCase(userRepo)

	userID := uuid.New()
	user := &entities.User{ID: userID, Email: "user@test.com", Name: "User"}
	userRepo.On("FindByID", mock.Anything, userID).Return(user, nil)

	_, err := uc.UpdateProfile(context.Background(), userID, dto.UpdateProfileRequest{Name: ""})
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusUnprocessableEntity, appErr.HTTPStatus)
}
