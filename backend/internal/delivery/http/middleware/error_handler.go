package middleware

import (
	"errors"
	"net/http"

	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) == 0 {
			return
		}

		err := c.Errors.Last().Err
		var appErr *apperrors.AppError
		if errors.As(err, &appErr) {
			body := gin.H{
				"code":    appErr.Code,
				"message": appErr.Message,
			}
			if len(appErr.Fields) > 0 {
				body["fields"] = appErr.Fields
			}
			c.JSON(appErr.HTTPStatus, gin.H{"error": body})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "an unexpected error occurred",
			},
		})
	}
}
