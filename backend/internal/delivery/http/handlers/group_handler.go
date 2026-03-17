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

type GroupHandler struct {
	groupUC *usecases.GroupUseCase
}

func NewGroupHandler(groupUC *usecases.GroupUseCase) *GroupHandler {
	return &GroupHandler{groupUC: groupUC}
}

func (h *GroupHandler) List(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	groups, err := h.groupUC.ListGroups(c.Request.Context(), courseID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": groups})
}

func (h *GroupHandler) Create(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	var req dto.CreateGroupRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	g, err := h.groupUC.CreateGroup(c.Request.Context(), courseID, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": g})
}

func (h *GroupHandler) Get(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid group id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	g, err := h.groupUC.GetGroup(c.Request.Context(), groupID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": g})
}

func (h *GroupHandler) Update(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid group id"))
		return
	}
	var req dto.UpdateGroupRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	g, err := h.groupUC.UpdateGroup(c.Request.Context(), groupID, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": g})
}

func (h *GroupHandler) Delete(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid group id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	if err := h.groupUC.DeleteGroup(c.Request.Context(), groupID, orgID); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (h *GroupHandler) ListMembers(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid group id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	members, err := h.groupUC.ListMembers(c.Request.Context(), groupID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": members})
}

func (h *GroupHandler) AddMember(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid group id"))
		return
	}
	var req dto.AddMemberRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	m, err := h.groupUC.AddMember(c.Request.Context(), groupID, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": m})
}

func (h *GroupHandler) RemoveMember(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid group id"))
		return
	}
	studentID, err := uuid.Parse(c.Param("studentID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid student id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	if err := h.groupUC.RemoveMember(c.Request.Context(), groupID, studentID, orgID); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (h *GroupHandler) AddSchedule(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid group id"))
		return
	}
	var req dto.CreateGroupScheduleRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	s, err := h.groupUC.AddSchedule(c.Request.Context(), groupID, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": s})
}

func (h *GroupHandler) ListSchedules(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid group id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	schedules, err := h.groupUC.ListSchedules(c.Request.Context(), groupID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": schedules})
}

func (h *GroupHandler) DeleteSchedule(c *gin.Context) {
	groupID, err := uuid.Parse(c.Param("groupID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid group id"))
		return
	}
	schedID, err := uuid.Parse(c.Param("schedID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid schedule id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	if err := h.groupUC.DeleteSchedule(c.Request.Context(), schedID, groupID, orgID); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (h *GroupHandler) GetMyGroup(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	studentID, _ := uuid.Parse(middleware.GetUserID(c))
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	g, err := h.groupUC.GetStudentGroup(c.Request.Context(), courseID, studentID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": g})
}
