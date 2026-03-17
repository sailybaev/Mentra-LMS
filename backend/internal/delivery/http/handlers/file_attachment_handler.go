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

type FileAttachmentHandler struct {
	fileAttachmentUC *usecases.FileAttachmentUseCase
}

func NewFileAttachmentHandler(fileAttachmentUC *usecases.FileAttachmentUseCase) *FileAttachmentHandler {
	return &FileAttachmentHandler{fileAttachmentUC: fileAttachmentUC}
}

func (h *FileAttachmentHandler) Create(c *gin.Context) {
	var req dto.CreateAttachmentRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	uploaderID, _ := uuid.Parse(middleware.GetUserID(c))
	attachment, err := h.fileAttachmentUC.CreateAttachment(c.Request.Context(), orgID, uploaderID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": attachment})
}

func (h *FileAttachmentHandler) ListByRef(c *gin.Context) {
	refType := c.Query("ref_type")
	refIDStr := c.Query("ref_id")
	if refType == "" || refIDStr == "" {
		c.Error(apperrors.ValidationError("ref_type and ref_id query params are required"))
		return
	}
	refID, err := uuid.Parse(refIDStr)
	if err != nil {
		c.Error(apperrors.ValidationError("invalid ref_id"))
		return
	}
	attachments, err := h.fileAttachmentUC.ListByRef(c.Request.Context(), refType, refID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": attachments})
}

func (h *FileAttachmentHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid attachment id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	if err := h.fileAttachmentUC.DeleteAttachment(c.Request.Context(), id, orgID); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
