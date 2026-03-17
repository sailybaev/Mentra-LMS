package usecases

import (
	"context"
	"net/http"
	"testing"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/mocks"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func TestGroupUseCase_CreateGroup_Success(t *testing.T) {
	groupRepo := new(mocks.MockGroupRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewGroupUseCase(groupRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	course := &entities.Course{ID: courseID, OrgID: orgID}

	courseRepo.On("FindByID", mock.Anything, courseID, orgID).Return(course, nil)
	groupRepo.On("CreateGroup", mock.Anything, mock.AnythingOfType("*entities.Group")).Return(nil)

	result, err := uc.CreateGroup(context.Background(), courseID, orgID, dto.CreateGroupRequest{Name: "Group A"})
	require.NoError(t, err)
	assert.Equal(t, "Group A", result.Name)
	assert.Equal(t, courseID.String(), result.CourseID)
}

func TestGroupUseCase_CreateGroup_CourseNotFound(t *testing.T) {
	groupRepo := new(mocks.MockGroupRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewGroupUseCase(groupRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	courseRepo.On("FindByID", mock.Anything, courseID, orgID).Return(nil, apperrors.NotFoundError("course", courseID.String()))

	_, err := uc.CreateGroup(context.Background(), courseID, orgID, dto.CreateGroupRequest{Name: "Group A"})
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusNotFound, appErr.HTTPStatus)
}

func TestGroupUseCase_AddMember_Success(t *testing.T) {
	groupRepo := new(mocks.MockGroupRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewGroupUseCase(groupRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	groupID := uuid.New()
	studentID := uuid.New()

	group := &entities.Group{ID: groupID, CourseID: courseID, OrgID: orgID}

	groupRepo.On("GetGroupByID", mock.Anything, groupID, orgID).Return(group, nil)
	groupRepo.On("GetStudentGroup", mock.Anything, courseID, studentID, orgID).Return(nil, apperrors.NotFoundError("group", ""))
	groupRepo.On("AddMember", mock.Anything, mock.AnythingOfType("*entities.GroupMember")).Return(nil)

	result, err := uc.AddMember(context.Background(), groupID, orgID, dto.AddMemberRequest{StudentID: studentID.String()})
	require.NoError(t, err)
	assert.Equal(t, studentID.String(), result.StudentID)
	assert.Equal(t, groupID.String(), result.GroupID)
}

func TestGroupUseCase_AddMember_AlreadyInGroup_ReturnsConflict(t *testing.T) {
	groupRepo := new(mocks.MockGroupRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewGroupUseCase(groupRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	groupID := uuid.New()
	studentID := uuid.New()

	group := &entities.Group{ID: groupID, CourseID: courseID, OrgID: orgID}
	existingGroup := &entities.Group{ID: uuid.New(), CourseID: courseID, OrgID: orgID}

	groupRepo.On("GetGroupByID", mock.Anything, groupID, orgID).Return(group, nil)
	groupRepo.On("GetStudentGroup", mock.Anything, courseID, studentID, orgID).Return(existingGroup, nil)

	_, err := uc.AddMember(context.Background(), groupID, orgID, dto.AddMemberRequest{StudentID: studentID.String()})
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusConflict, appErr.HTTPStatus)
}

func TestGroupUseCase_CreateGroup_WithTeacherID(t *testing.T) {
	groupRepo := new(mocks.MockGroupRepository)
	courseRepo := new(mocks.MockCourseRepository)
	uc := NewGroupUseCase(groupRepo, courseRepo)

	orgID := uuid.New()
	courseID := uuid.New()
	teacherID := uuid.New()
	course := &entities.Course{ID: courseID, OrgID: orgID}

	courseRepo.On("FindByID", mock.Anything, courseID, orgID).Return(course, nil)
	groupRepo.On("CreateGroup", mock.Anything, mock.AnythingOfType("*entities.Group")).Return(nil)

	teacherIDStr := teacherID.String()
	result, err := uc.CreateGroup(context.Background(), courseID, orgID, dto.CreateGroupRequest{Name: "Group B", TeacherID: &teacherIDStr})
	require.NoError(t, err)
	require.NotNil(t, result.TeacherID)
	assert.Equal(t, teacherIDStr, *result.TeacherID)
}
