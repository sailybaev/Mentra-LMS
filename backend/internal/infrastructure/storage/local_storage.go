package storage

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
)

type LocalStorage struct {
	BaseDir string
}

func NewLocalStorage(baseDir string) *LocalStorage {
	if baseDir == "" {
		baseDir = "./uploads"
	}
	return &LocalStorage{BaseDir: baseDir}
}

func (s *LocalStorage) Save(file multipart.File, header *multipart.FileHeader, orgID string) (string, error) {
	orgDir := filepath.Join(s.BaseDir, orgID)
	if err := os.MkdirAll(orgDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create upload directory: %w", err)
	}

	ext := filepath.Ext(header.Filename)
	storedName := fmt.Sprintf("%s_%d%s", uuid.New().String(), time.Now().UnixMilli(), ext)
	storedPath := filepath.Join(orgDir, storedName)

	dst, err := os.Create(storedPath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %w", err)
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		return "", fmt.Errorf("failed to save file: %w", err)
	}

	// Return relative path for serving
	return filepath.Join("uploads", orgID, storedName), nil
}
