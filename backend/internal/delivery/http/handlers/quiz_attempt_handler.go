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

type QuizAttemptHandler struct {
	attemptUC *usecases.QuizAttemptUseCase
}

func NewQuizAttemptHandler(attemptUC *usecases.QuizAttemptUseCase) *QuizAttemptHandler {
	return &QuizAttemptHandler{attemptUC: attemptUC}
}

func (h *QuizAttemptHandler) SubmitAttempt(c *gin.Context) {
	quizID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid quiz id"))
		return
	}
	var req dto.SubmitQuizAttemptRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	studentID, _ := uuid.Parse(middleware.GetUserID(c))
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	result, err := h.attemptUC.Submit(c.Request.Context(), quizID, studentID, orgID, req.Answers)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *QuizAttemptHandler) GetMyAttempt(c *gin.Context) {
	quizID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid quiz id"))
		return
	}
	studentID, _ := uuid.Parse(middleware.GetUserID(c))
	result, err := h.attemptUC.GetMyAttempt(c.Request.Context(), quizID, studentID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}
