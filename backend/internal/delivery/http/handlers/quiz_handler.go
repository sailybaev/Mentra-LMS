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

type QuizHandler struct {
	quizUC *usecases.QuizUseCase
}

func NewQuizHandler(quizUC *usecases.QuizUseCase) *QuizHandler {
	return &QuizHandler{quizUC: quizUC}
}

func (h *QuizHandler) Create(c *gin.Context) {
	lessonID, err := uuid.Parse(c.Param("lessonID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid lesson id"))
		return
	}
	var req dto.CreateQuizRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	quiz, err := h.quizUC.CreateQuiz(c.Request.Context(), lessonID, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": quiz})
}

func (h *QuizHandler) GetByLesson(c *gin.Context) {
	lessonID, err := uuid.Parse(c.Param("lessonID"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid lesson id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	quiz, err := h.quizUC.GetQuizByLesson(c.Request.Context(), lessonID, orgID)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": quiz})
}

func (h *QuizHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid quiz id"))
		return
	}
	var req dto.UpdateQuizRequest
	if err := bindJSON(c, &req); err != nil {
		c.Error(err)
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	quiz, err := h.quizUC.UpdateQuiz(c.Request.Context(), id, orgID, req)
	if err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": quiz})
}

func (h *QuizHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Error(apperrors.ValidationError("invalid quiz id"))
		return
	}
	orgID, _ := uuid.Parse(middleware.GetOrgID(c))
	if err := h.quizUC.DeleteQuiz(c.Request.Context(), id, orgID); err != nil {
		c.Error(err)
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
