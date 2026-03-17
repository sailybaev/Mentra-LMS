package handlers

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	apperrors "github.com/ailms/backend/pkg/errors"
)

// bindJSON binds the request body and returns a structured *AppError on failure.
// Validation errors are keyed by the JSON field name, not the Go struct field name.
func bindJSON(c *gin.Context, dst any) error {
	if err := c.ShouldBindJSON(dst); err != nil {
		var ve validator.ValidationErrors
		if ok := isValidationErrors(err, &ve); ok {
			return apperrors.FieldValidationError(formatValidationErrors(dst, ve))
		}
		return apperrors.ValidationError(err.Error())
	}
	return nil
}

func isValidationErrors(err error, out *validator.ValidationErrors) bool {
	ve, ok := err.(validator.ValidationErrors)
	if ok {
		*out = ve
	}
	return ok
}

// formatValidationErrors maps each failed field to its JSON tag name and a
// human-readable rule message.
func formatValidationErrors(dst any, ve validator.ValidationErrors) map[string]string {
	t := reflect.TypeOf(dst)
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}

	fields := make(map[string]string, len(ve))
	for _, fe := range ve {
		jsonName := jsonFieldName(t, fe.StructField())
		fields[jsonName] = ruleMessage(fe)
	}
	return fields
}

// jsonFieldName returns the json tag value for the struct field with the given
// Go name, falling back to lowercase of the Go name if no tag is found.
func jsonFieldName(t reflect.Type, goName string) string {
	if t.Kind() != reflect.Struct {
		return strings.ToLower(goName)
	}
	sf, ok := t.FieldByName(goName)
	if !ok {
		return strings.ToLower(goName)
	}
	tag := sf.Tag.Get("json")
	if tag == "" || tag == "-" {
		return strings.ToLower(goName)
	}
	return strings.Split(tag, ",")[0]
}

// ruleMessage converts a validator FieldError into a human-readable string.
func ruleMessage(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "is required"
	case "email":
		return "must be a valid email address"
	case "min":
		return fmt.Sprintf("must be at least %s characters", fe.Param())
	case "max":
		return fmt.Sprintf("must be at most %s characters", fe.Param())
	case "alphanum":
		return "must contain only letters and numbers (no spaces)"
	case "oneof":
		return fmt.Sprintf("must be one of: %s", strings.ReplaceAll(fe.Param(), " ", ", "))
	case "uuid":
		return "must be a valid UUID"
	default:
		return fmt.Sprintf("failed validation rule: %s", fe.Tag())
	}
}
