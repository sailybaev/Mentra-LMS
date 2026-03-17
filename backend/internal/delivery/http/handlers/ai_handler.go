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

type AIHandler struct {
	aiUC *usecases.AIUseCase
}

func NewAIHandler(aiUC *usecases.AIUseCase) *AIHandler {
	return &AIHandler{aiUC: aiUC}
}

func (h *AIHandler) SummarizeLesson(c *gin.Context) {
	var req dto.SummarizeLessonRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	lessonID, err := uuid.Parse(req.LessonID)
	if err != nil {
		c.Error(apperrors.ValidationError("invalid lesson id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	resp, err := h.aiUC.SummarizeLesson(c.Request.Context(), lessonID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

func (h *AIHandler) GenerateQuiz(c *gin.Context) {
	var req dto.GenerateQuizRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	lessonID, err := uuid.Parse(req.LessonID)
	if err != nil {
		c.Error(apperrors.ValidationError("invalid lesson id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	quiz, err := h.aiUC.GenerateQuiz(c.Request.Context(), lessonID, orgID, req.NumQuestions)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": quiz})
}
