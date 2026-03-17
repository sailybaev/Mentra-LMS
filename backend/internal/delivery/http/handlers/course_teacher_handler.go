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

type CourseTeacherHandler struct {
	ctUC *usecases.CourseTeacherUseCase
}

func NewCourseTeacherHandler(ctUC *usecases.CourseTeacherUseCase) *CourseTeacherHandler {
	return &CourseTeacherHandler{ctUC: ctUC}
}

func (h *CourseTeacherHandler) List(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	teachers, err := h.ctUC.ListTeachers(c.Request.Context(), courseID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": teachers})
}

func (h *CourseTeacherHandler) Assign(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	var req dto.AssignTeacherRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	teacherID, err := uuid.Parse(req.TeacherID)
	if err != nil {
		c.Error(apperrors.ValidationError("invalid teacher_id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	ct, err := h.ctUC.AssignTeacher(c.Request.Context(), courseID, teacherID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": ct})
}

func (h *CourseTeacherHandler) Remove(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	teacherID, err := uuid.Parse(c.Param("teacherID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid teacher id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	if err := h.ctUC.RemoveTeacher(c.Request.Context(), courseID, teacherID, orgID); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
