package usecases

import (
	"context"
	"time"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/domain/repositories"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
)

type CourseTeacherUseCase struct {
	ctRepo     repositories.CourseTeacherRepository
	memberRepo repositories.MembershipRepository
}

func NewCourseTeacherUseCase(ctRepo repositories.CourseTeacherRepository, memberRepo repositories.MembershipRepository) *CourseTeacherUseCase {
	return &CourseTeacherUseCase{ctRepo: ctRepo, memberRepo: memberRepo}
}

func (uc *CourseTeacherUseCase) AssignTeacher(ctx context.Context, courseID, teacherID, orgID uuid.UUID) (*dto.CourseTeacherDTO, error) {
	role, err := uc.memberRepo.FindUserRole(ctx, teacherID, orgID)
	if err != nil {
		return nil, apperrors.NotFoundError("member", teacherID.String())
	}
	if role != entities.RoleTeacher && role != entities.RoleAdmin {
		return nil, apperrors.ValidationError("user is not a teacher or admin")
	}

	exists, err := uc.ctRepo.Exists(ctx, courseID, teacherID, orgID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, apperrors.ConflictError("teacher is already assigned to this course")
	}

	ct := &entities.CourseTeacher{
		ID:         uuid.New(),
		CourseID:   courseID,
		TeacherID:  teacherID,
		OrgID:      orgID,
		AssignedAt: time.Now(),
	}
	if err := uc.ctRepo.Add(ctx, ct); err != nil {
		return nil, err
	}
	return toCourseTeacherDTO(ct), nil
}

func (uc *CourseTeacherUseCase) RemoveTeacher(ctx context.Context, courseID, teacherID, orgID uuid.UUID) error {
	return uc.ctRepo.Remove(ctx, courseID, teacherID, orgID)
}

func (uc *CourseTeacherUseCase) ListTeachers(ctx context.Context, courseID, orgID uuid.UUID) ([]dto.CourseTeacherDTO, error) {
	cts, err := uc.ctRepo.ListByCourse(ctx, courseID, orgID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.CourseTeacherDTO, len(cts))
	for i, ct := range cts {
		result[i] = *toCourseTeacherDTO(&ct)
	}
	return result, nil
}

func toCourseTeacherDTO(ct *entities.CourseTeacher) *dto.CourseTeacherDTO {
	return &dto.CourseTeacherDTO{
		ID:         ct.ID.String(),
		CourseID:   ct.CourseID.String(),
		TeacherID:  ct.TeacherID.String(),
		OrgID:      ct.OrgID.String(),
		AssignedAt: ct.AssignedAt,
	}
}
