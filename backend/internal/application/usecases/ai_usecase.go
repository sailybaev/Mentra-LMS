package usecases

import (
	"context"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/repositories"
	"github.com/ailms/backend/internal/domain/services"
	"github.com/google/uuid"
)

type AIUseCase struct {
	lessonRepo repositories.LessonRepository
	quizRepo   repositories.QuizRepository
	aiService  services.AIService
}

func NewAIUseCase(
	lessonRepo repositories.LessonRepository,
	quizRepo repositories.QuizRepository,
	aiService services.AIService,
) *AIUseCase {
	return &AIUseCase{lessonRepo: lessonRepo, quizRepo: quizRepo, aiService: aiService}
}

func (uc *AIUseCase) SummarizeLesson(ctx context.Context, lessonID, orgID uuid.UUID) (*dto.SummarizeLessonResponse, error) {
	lesson, err := uc.lessonRepo.FindByID(ctx, lessonID, orgID)
	if err != nil {
		return nil, err
	}

	summary, err := uc.aiService.GenerateLessonSummary(ctx, lesson.Content)
	if err != nil {
		return nil, err
	}

	return &dto.SummarizeLessonResponse{Summary: summary}, nil
}

func (uc *AIUseCase) GenerateQuiz(ctx context.Context, lessonID, orgID uuid.UUID, numQuestions int) (*dto.QuizDTO, error) {
	lesson, err := uc.lessonRepo.FindByID(ctx, lessonID, orgID)
	if err != nil {
		return nil, err
	}

	questions, err := uc.aiService.GenerateQuiz(ctx, lesson.Content, numQuestions)
	if err != nil {
		return nil, err
	}

	// Convert domain questions to QuizDTO questions inline
	questionDTOs := make([]dto.QuestionDTO, len(questions))
	for i, q := range questions {
		answers := make([]dto.AnswerDTO, len(q.Answers))
		for j, a := range q.Answers {
			answers[j] = dto.AnswerDTO{
				ID:        a.ID.String(),
				Answer:    a.Answer,
				IsCorrect: a.IsCorrect,
			}
		}
		questionDTOs[i] = dto.QuestionDTO{
			ID:       q.ID.String(),
			Question: q.Question,
			Position: q.Position,
			Answers:  answers,
		}
	}

	return &dto.QuizDTO{
		LessonID:  lessonID.String(),
		OrgID:     orgID.String(),
		Title:     "AI Generated Quiz for " + lesson.Title,
		Questions: questionDTOs,
	}, nil
}
