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

type LessonHandler struct {
	lessonUC *usecases.LessonUseCase
}

func NewLessonHandler(lessonUC *usecases.LessonUseCase) *LessonHandler {
	return &LessonHandler{lessonUC: lessonUC}
}

func (h *LessonHandler) List(c *gin.Context) {
	moduleID, err := uuid.Parse(c.Param("moduleID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid module id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	lessons, err := h.lessonUC.ListLessons(c.Request.Context(), moduleID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lessons})
}

func (h *LessonHandler) Create(c *gin.Context) {
	moduleID, err := uuid.Parse(c.Param("moduleID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid module id"))
		return
	}
	var req dto.CreateLessonRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	lesson, err := h.lessonUC.CreateLesson(c.Request.Context(), moduleID, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": lesson})
}

func (h *LessonHandler) Get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("lessonID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid lesson id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	lesson, err := h.lessonUC.GetLesson(c.Request.Context(), id, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lesson})
}

func (h *LessonHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("lessonID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid lesson id"))
		return
	}
	var req dto.UpdateLessonRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	lesson, err := h.lessonUC.UpdateLesson(c.Request.Context(), id, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lesson})
}

func (h *LessonHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("lessonID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid lesson id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	if err := h.lessonUC.DeleteLesson(c.Request.Context(), id, orgID); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
