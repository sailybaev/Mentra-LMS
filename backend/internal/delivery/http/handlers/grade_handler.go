package handlers

import (
	"net/http"

	"github.com/ailms/backend/internal/application/usecases"
	"github.com/ailms/backend/internal/delivery/http/middleware"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type GradeHandler struct {
	gradeUC *usecases.GradeUseCase
}

func NewGradeHandler(gradeUC *usecases.GradeUseCase) *GradeHandler {
	return &GradeHandler{gradeUC: gradeUC}
}

func (h *GradeHandler) GetMyGrades(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	studentID, _ := uuid.Parse(middleware.GetUserID(c))
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	result, err := h.gradeUC.GetMyGrades(c.Request.Context(), courseID, studentID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *GradeHandler) GetUpcomingDeadlines(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	studentID, _ := uuid.Parse(middleware.GetUserID(c))
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	result, err := h.gradeUC.GetUpcomingDeadlines(c.Request.Context(), courseID, studentID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}
