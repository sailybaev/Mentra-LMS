package middleware

import (
	"github.com/ailms/backend/internal/domain/entities"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/gin-gonic/gin"
)

func RequireRole(roles ...entities.Role) gin.HandlerFunc {
	allowed := make(map[string]bool, len(roles))
	for _, r := range roles {
		allowed[string(r)] = true
	}
	return func(c *gin.Context) {
		role := GetRole(c)
		if !allowed[role] {
			c.Error(apperrors.ForbiddenError("insufficient role"))
			c.Abort()
			return
		}
		c.Next()
	}
}
