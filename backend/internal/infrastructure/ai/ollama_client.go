package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/infrastructure/config"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
)

type OllamaClient struct {
	baseURL    string
	model      string
	httpClient *http.Client
}

type ollamaRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"`
}

type ollamaResponse struct {
	Response string `json:"response"`
}

func NewOllamaClient(cfg config.OllamaConfig) *OllamaClient {
	return &OllamaClient{
		baseURL: cfg.BaseURL,
		model:   cfg.Model,
		httpClient: &http.Client{
			Timeout: time.Duration(cfg.TimeoutSeconds) * time.Second,
		},
	}
}

func (c *OllamaClient) generate(ctx context.Context, prompt string) (string, error) {
	reqBody := ollamaRequest{
		Model:  c.model,
		Prompt: prompt,
		Stream: false,
	}
	data, err := json.Marshal(reqBody)
	if err != nil {
		return "", apperrors.InternalError("failed to marshal ollama request")
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/api/generate", bytes.NewReader(data))
	if err != nil {
		return "", apperrors.InternalError("failed to create ollama request")
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", apperrors.InternalError(fmt.Sprintf("ollama request failed: %s", err.Error()))
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", apperrors.InternalError("failed to read ollama response")
	}

	var ollamaResp ollamaResponse
	if err := json.Unmarshal(body, &ollamaResp); err != nil {
		return "", apperrors.InternalError("failed to parse ollama response")
	}
	return ollamaResp.Response, nil
}

func (c *OllamaClient) GenerateLessonSummary(ctx context.Context, lessonContent string) (string, error) {
	prompt := fmt.Sprintf(`Summarize the following lesson content in 2-3 concise paragraphs:

%s

Provide only the summary, no additional commentary.`, lessonContent)
	return c.generate(ctx, prompt)
}

func (c *OllamaClient) GenerateQuiz(ctx context.Context, lessonContent string, numQuestions int) ([]entities.QuizQuestion, error) {
	prompt := fmt.Sprintf(`Based on the following lesson content, generate %d quiz questions in JSON format.
Each question should have 4 answer options with exactly one correct answer.

Lesson content:
%s

Return ONLY valid JSON in this exact format:
[
  {
    "question": "Question text here",
    "position": 1,
    "answers": [
      {"answer": "Option A", "is_correct": false},
      {"answer": "Option B", "is_correct": true},
      {"answer": "Option C", "is_correct": false},
      {"answer": "Option D", "is_correct": false}
    ]
  }
]`, numQuestions, lessonContent)

	response, err := c.generate(ctx, prompt)
	if err != nil {
		return nil, err
	}

	type answerJSON struct {
		Answer    string `json:"answer"`
		IsCorrect bool   `json:"is_correct"`
	}
	type questionJSON struct {
		Question string       `json:"question"`
		Position int          `json:"position"`
		Answers  []answerJSON `json:"answers"`
	}

	var questions []questionJSON
	if err := json.Unmarshal([]byte(response), &questions); err != nil {
		return nil, apperrors.InternalError("failed to parse AI quiz response")
	}

	now := time.Now()
	result := make([]entities.QuizQuestion, len(questions))
	for i, q := range questions {
		answers := make([]entities.QuizAnswer, len(q.Answers))
		for j, a := range q.Answers {
			answers[j] = entities.QuizAnswer{
				ID:        uuid.New(),
				Answer:    a.Answer,
				IsCorrect: a.IsCorrect,
				CreatedAt: now,
				UpdatedAt: now,
			}
		}
		result[i] = entities.QuizQuestion{
			ID:        uuid.New(),
			Question:  q.Question,
			Position:  q.Position,
			Answers:   answers,
			CreatedAt: now,
			UpdatedAt: now,
		}
	}
	return result, nil
}

func (c *OllamaClient) GenerateProgressInsights(ctx context.Context, progress []entities.LessonProgress) (string, error) {
	completedCount := 0
	var totalScore float64
	var scoreCount int
	for _, p := range progress {
		if p.CompletedAt != nil {
			completedCount++
		}
		if p.Score != nil {
			totalScore += *p.Score
			scoreCount++
		}
	}
	avgScore := 0.0
	if scoreCount > 0 {
		avgScore = totalScore / float64(scoreCount)
	}

	prompt := fmt.Sprintf(`A student has completed %d lessons out of %d total tracked, with an average score of %.1f%%.
Provide 2-3 sentences of personalized learning insights and encouragement based on this progress.`,
		completedCount, len(progress), avgScore)

	return c.generate(ctx, prompt)
}
