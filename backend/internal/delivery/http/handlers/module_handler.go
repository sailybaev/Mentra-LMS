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

type ModuleHandler struct {
	moduleUC *usecases.ModuleUseCase
}

func NewModuleHandler(moduleUC *usecases.ModuleUseCase) *ModuleHandler {
	return &ModuleHandler{moduleUC: moduleUC}
}

func (h *ModuleHandler) List(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	modules, err := h.moduleUC.ListModules(c.Request.Context(), courseID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": modules})
}

func (h *ModuleHandler) Create(c *gin.Context) {
	courseID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid course id"))
		return
	}
	var req dto.CreateModuleRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	module, err := h.moduleUC.CreateModule(c.Request.Context(), courseID, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": module})
}

func (h *ModuleHandler) Get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("moduleID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid module id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	module, err := h.moduleUC.GetModule(c.Request.Context(), id, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": module})
}

func (h *ModuleHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("moduleID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid module id"))
		return
	}
	var req dto.UpdateModuleRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	module, err := h.moduleUC.UpdateModule(c.Request.Context(), id, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": module})
}

func (h *ModuleHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("moduleID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid module id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	if err := h.moduleUC.DeleteModule(c.Request.Context(), id, orgID); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
