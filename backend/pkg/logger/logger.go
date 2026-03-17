package logger

import (
	"log/slog"
	"os"
	"sync"
)

type Logger struct {
	*slog.Logger
}

var (
	defaultLogger *Logger
	once          sync.Once
)

func New(level slog.Level, format string) *Logger {
	var handler slog.Handler
	opts := &slog.HandlerOptions{Level: level}
	if format == "json" {
		handler = slog.NewJSONHandler(os.Stdout, opts)
	} else {
		handler = slog.NewTextHandler(os.Stdout, opts)
	}
	return &Logger{slog.New(handler)}
}

func Default() *Logger {
	once.Do(func() {
		defaultLogger = New(slog.LevelInfo, "json")
	})
	return defaultLogger
}

func SetDefault(l *Logger) {
	defaultLogger = l
}
