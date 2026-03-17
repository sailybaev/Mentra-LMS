package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	apperrors "github.com/ailms/backend/pkg/errors"
)

type contextKey string

const (
	ContextKeyUserID contextKey = "user_id"
	ContextKeyOrgID  contextKey = "org_id"
	ContextKeyRole   contextKey = "role"
)

func Auth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Error(apperrors.UnauthorizedError("missing authorization header"))
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.Error(apperrors.UnauthorizedError("invalid authorization header format"))
			c.Abort()
			return
		}

		token, err := jwt.Parse(parts[1], func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, apperrors.UnauthorizedError("unexpected signing method")
			}
			return []byte(jwtSecret), nil
		})
		if err != nil || !token.Valid {
			c.Error(apperrors.UnauthorizedError("invalid or expired token"))
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.Error(apperrors.UnauthorizedError("invalid token claims"))
			c.Abort()
			return
		}

		c.Set(string(ContextKeyUserID), claims["user_id"])
		c.Set(string(ContextKeyOrgID), claims["org_id"])
		c.Set(string(ContextKeyRole), claims["role"])
		c.Next()
	}
}

func GetUserID(c *gin.Context) string {
	v, _ := c.Get(string(ContextKeyUserID))
	s, _ := v.(string)
	return s
}

func GetOrgID(c *gin.Context) string {
	v, _ := c.Get(string(ContextKeyOrgID))
	s, _ := v.(string)
	return s
}

func GetRole(c *gin.Context) string {
	v, _ := c.Get(string(ContextKeyRole))
	s, _ := v.(string)
	return s
}
