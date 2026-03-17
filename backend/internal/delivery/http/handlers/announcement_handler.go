package handlers

import (
	"net/http"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/application/usecases"
	"github.com/ailms/backend/internal/delivery/http/middleware"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/ailms/backend/pkg/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AnnouncementHandler struct {
	announcementUC *usecases.AnnouncementUseCase
}

func NewAnnouncementHandler(announcementUC *usecases.AnnouncementUseCase) *AnnouncementHandler {
	return &AnnouncementHandler{announcementUC: announcementUC}
}

func (h *AnnouncementHandler) List(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	p := utils.ParsePagination(c)
	announcements, total, err := h.announcementUC.ListAnnouncements(c.Request.Context(), courseID, orgID, p.Page, p.PageSize)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, utils.PaginatedResponse[dto.AnnouncementDTO]{
		Data: announcements,
		Meta: utils.PaginationMeta{Page: p.Page, PageSize: p.PageSize, Total: total},
	})
}

func (h *AnnouncementHandler) Create(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	var req dto.CreateAnnouncementRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	userID, _ := uuid.Parse(middleware.GetUserID(c))
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	a, err := h.announcementUC.CreateAnnouncement(c.Request.Context(), courseID, orgID, userID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": a})
}

func (h *AnnouncementHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("aID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid announcement id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	if err := h.announcementUC.DeleteAnnouncement(c.Request.Context(), id, orgID); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
