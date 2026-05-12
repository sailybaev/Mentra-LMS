package mocks

import (
	"context"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type MockCourseTeacherRepository struct {
	mock.Mock
}

func (m *MockCourseTeacherRepository) Add(ctx context.Context, ct *entities.CourseTeacher) error {
	args := m.Called(ctx, ct)
	return args.Error(0)
}

func (m *MockCourseTeacherRepository) Remove(ctx context.Context, courseID, teacherID, orgID uuid.UUID) error {
	args := m.Called(ctx, courseID, teacherID, orgID)
	return args.Error(0)
}

func (m *MockCourseTeacherRepository) ListByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]entities.CourseTeacher, error) {
	args := m.Called(ctx, courseID, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]entities.CourseTeacher), args.Error(1)
}

func (m *MockCourseTeacherRepository) ListByTeacher(ctx context.Context, teacherID, orgID uuid.UUID) ([]entities.CourseTeacher, error) {
	args := m.Called(ctx, teacherID, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]entities.CourseTeacher), args.Error(1)
}

func (m *MockCourseTeacherRepository) Exists(ctx context.Context, courseID, teacherID, orgID uuid.UUID) (bool, error) {
	args := m.Called(ctx, courseID, teacherID, orgID)
	return args.Bool(0), args.Error(1)
}

func (m *MockCourseTeacherRepository) FindCourseIDsByTeacher(ctx context.Context, teacherID, orgID uuid.UUID) ([]uuid.UUID, error) {
	args := m.Called(ctx, teacherID, orgID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]uuid.UUID), args.Error(1)
}
