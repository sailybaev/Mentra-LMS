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

type MemberHandler struct {
	memberUC *usecases.MemberUseCase
}

func NewMemberHandler(memberUC *usecases.MemberUseCase) *MemberHandler {
	return &MemberHandler{memberUC: memberUC}
}

func (h *MemberHandler) List(c *gin.Context) {
	orgID, err := uuid.Parse(middleware.GetOrgID(c))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid org id"))
		return
	}
	role := c.Query("role")
	p := utils.ParsePagination(c)
	members, total, err := h.memberUC.ListMembers(c.Request.Context(), orgID, role, p.Page, p.PageSize)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, utils.PaginatedResponse[dto.MemberDTO]{
		Data: members,
		Meta: utils.PaginationMeta{Page: p.Page, PageSize: p.PageSize, Total: total},
	})
}

func (h *MemberHandler) Invite(c *gin.Context) {
	orgID, err := uuid.Parse(middleware.GetOrgID(c))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid org id"))
		return
	}
	var req dto.InviteMemberRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	member, err := h.memberUC.InviteMember(c.Request.Context(), orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": member})
}

func (h *MemberHandler) BulkImport(c *gin.Context) {
	orgID, err := uuid.Parse(middleware.GetOrgID(c))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid org id"))
		return
	}
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.Error(apperrors.ValidationError("file is required"))
		return
	}
	defer file.Close()

	result, err := h.memberUC.BulkImportCSV(c.Request.Context(), orgID, file)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *MemberHandler) Remove(c *gin.Context) {
	membershipID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid membership id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	if err := h.memberUC.RemoveMember(c.Request.Context(), membershipID, orgID); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (h *MemberHandler) UpdateRole(c *gin.Context) {
	membershipID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid membership id"))
		return
	}
	var req dto.UpdateMemberRoleRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	member, err := h.memberUC.UpdateRole(c.Request.Context(), membershipID, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": member})
}
