package handlers

import (
	"net/http"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/application/usecases"
	"github.com/ailms/backend/internal/delivery/http/middleware"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	userUC *usecases.UserUseCase
}

func NewUserHandler(userUC *usecases.UserUseCase) *UserHandler {
	return &UserHandler{userUC: userUC}
}

func (h *UserHandler) GetMe(c *gin.Context) {
	rawID := middleware.GetUserID(c)
	userID, err := uuid.Parse(rawID)
	if err != nil {
		c.Error(apperrors.UnauthorizedError("invalid user id in token"))
		return
	}

	profile, err := h.userUC.GetProfile(c.Request.Context(), userID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": profile})
}

func (h *UserHandler) UpdateMe(c *gin.Context) {
	rawID := middleware.GetUserID(c)
	userID, err := uuid.Parse(rawID)
	if err != nil {
		c.Error(apperrors.UnauthorizedError("invalid user id in token"))
		return
	}

	var req dto.UpdateProfileRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}

	profile, err := h.userUC.UpdateProfile(c.Request.Context(), userID, req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": profile})
}
