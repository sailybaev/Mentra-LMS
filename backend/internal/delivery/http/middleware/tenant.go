package middleware

import (
	"github.com/ailms/backend/internal/domain/repositories"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/gin-gonic/gin"
)

func Tenant(orgRepo repositories.OrganizationRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		slug := c.GetHeader("X-Org-Slug")
		if slug == "" {
			c.Error(apperrors.ValidationError("X-Org-Slug header is required"))
			c.Abort()
			return
		}

		org, err := orgRepo.FindBySlug(c.Request.Context(), slug)
		if err != nil {
			c.Error(apperrors.NotFoundError("organization", slug))
			c.Abort()
			return
		}

		c.Set(string(ContextKeyOrgID), org.ID.String())
		c.Next()
	}
}
