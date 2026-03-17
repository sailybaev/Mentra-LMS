package handlers

import (
	"net/http"

	"github.com/ailms/backend/internal/delivery/http/middleware"
	"github.com/ailms/backend/internal/infrastructure/storage"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/gin-gonic/gin"
)

type UploadHandler struct {
	storage *storage.LocalStorage
}

func NewUploadHandler(storage *storage.LocalStorage) *UploadHandler {
	return &UploadHandler{storage: storage}
}

func (h *UploadHandler) Upload(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.Error(apperrors.ValidationError("file is required"))
		return
	}
	defer file.Close()

	orgID := middleware.GetOrgID(c)
	storedPath, err := h.storage.Save(file, header, orgID)
	if err != nil {
		c.Error(apperrors.InternalError("failed to save file: " + err.Error()))
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gin.H{
		"path": storedPath,
		"name": header.Filename,
	}})
}
