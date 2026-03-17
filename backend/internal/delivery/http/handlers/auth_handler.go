package handlers

import (
	"net/http"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/application/usecases"
	"github.com/ailms/backend/internal/delivery/http/middleware"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authUC *usecases.AuthUseCase
}

func NewAuthHandler(authUC *usecases.AuthUseCase) *AuthHandler {
	return &AuthHandler{authUC: authUC}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}

	resp, err := h.authUC.Register(c.Request.Context(), req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": resp})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}

	orgSlug := c.GetHeader("X-Org-Slug")
	if orgSlug == "" {
		c.Error(apperrors.ValidationError("X-Org-Slug header is required"))
		return
	}

	resp, err := h.authUC.Login(c.Request.Context(), req, orgSlug)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": resp})
}

// suppress unused import warning
var _ = middleware.GetUserID
