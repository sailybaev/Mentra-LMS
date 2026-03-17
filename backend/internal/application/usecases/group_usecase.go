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

type GroupUseCase struct {
	groupRepo  repositories.GroupRepository
	courseRepo repositories.CourseRepository
}

func NewGroupUseCase(groupRepo repositories.GroupRepository, courseRepo repositories.CourseRepository) *GroupUseCase {
	return &GroupUseCase{groupRepo: groupRepo, courseRepo: courseRepo}
}

func (uc *GroupUseCase) CreateGroup(ctx context.Context, courseID *uuid.UUID, orgID uuid.UUID, req dto.CreateGroupRequest) (*dto.GroupDTO, error) {
	if courseID != nil {
		if _, err := uc.courseRepo.FindByID(ctx, *courseID, orgID); err != nil {
			return nil, err
		}
	}
	now := time.Now()
	g := &entities.Group{
		ID:        uuid.New(),
		CourseID:  courseID,
		OrgID:     orgID,
		Name:      req.Name,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if req.TeacherID != nil {
		tid, err := uuid.Parse(*req.TeacherID)
		if err != nil {
			return nil, apperrors.ValidationError("invalid teacher_id")
		}
		g.TeacherID = &tid
	}
	if err := uc.groupRepo.CreateGroup(ctx, g); err != nil {
		return nil, err
	}
	return toGroupDTO(g), nil
}

func (uc *GroupUseCase) GetGroup(ctx context.Context, id, orgID uuid.UUID) (*dto.GroupDTO, error) {
	g, err := uc.groupRepo.GetGroupByID(ctx, id, orgID)
	if err != nil {
		return nil, err
	}
	return toGroupDTO(g), nil
}

func (uc *GroupUseCase) ListByOrg(ctx context.Context, orgID uuid.UUID) ([]dto.GroupDTO, error) {
	groups, err := uc.groupRepo.ListGroupsByOrg(ctx, orgID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.GroupDTO, len(groups))
	for i, g := range groups {
		result[i] = *toGroupDTO(&g)
	}
	return result, nil
}

func (uc *GroupUseCase) AssignToCourse(ctx context.Context, groupID, courseID, orgID uuid.UUID) error {
	if _, err := uc.courseRepo.FindByID(ctx, courseID, orgID); err != nil {
		return err
	}
	return uc.groupRepo.AssignToCourse(ctx, groupID, courseID, orgID)
}

func (uc *GroupUseCase) UnassignFromCourse(ctx context.Context, groupID, orgID uuid.UUID) error {
	return uc.groupRepo.UnassignFromCourse(ctx, groupID, orgID)
}

func (uc *GroupUseCase) ListGroups(ctx context.Context, courseID, orgID uuid.UUID) ([]dto.GroupDTO, error) {
	groups, err := uc.groupRepo.ListGroupsByCourse(ctx, courseID, orgID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.GroupDTO, len(groups))
	for i, g := range groups {
		result[i] = *toGroupDTO(&g)
	}
	return result, nil
}

func (uc *GroupUseCase) UpdateGroup(ctx context.Context, id, orgID uuid.UUID, req dto.UpdateGroupRequest) (*dto.GroupDTO, error) {
	g, err := uc.groupRepo.GetGroupByID(ctx, id, orgID)
	if err != nil {
		return nil, err
	}
	if req.Name != "" {
		g.Name = req.Name
	}
	if req.TeacherID != nil {
		tid, err := uuid.Parse(*req.TeacherID)
		if err != nil {
			return nil, apperrors.ValidationError("invalid teacher_id")
		}
		g.TeacherID = &tid
	}
	g.UpdatedAt = time.Now()
	if err := uc.groupRepo.UpdateGroup(ctx, g); err != nil {
		return nil, err
	}
	return toGroupDTO(g), nil
}

func (uc *GroupUseCase) DeleteGroup(ctx context.Context, id, orgID uuid.UUID) error {
	return uc.groupRepo.DeleteGroup(ctx, id, orgID)
}

func (uc *GroupUseCase) AddSchedule(ctx context.Context, groupID, orgID uuid.UUID, req dto.CreateGroupScheduleRequest) (*dto.GroupScheduleDTO, error) {
	if _, err := uc.groupRepo.GetGroupByID(ctx, groupID, orgID); err != nil {
		return nil, err
	}
	s := &entities.GroupSchedule{
		ID:        uuid.New(),
		GroupID:   groupID,
		DayOfWeek: req.DayOfWeek,
		StartTime: req.StartTime,
		EndTime:   req.EndTime,
		Location:  req.Location,
		CreatedAt: time.Now(),
	}
	if err := uc.groupRepo.AddSchedule(ctx, s); err != nil {
		return nil, err
	}
	return toGroupScheduleDTO(s), nil
}

func (uc *GroupUseCase) ListSchedules(ctx context.Context, groupID, orgID uuid.UUID) ([]dto.GroupScheduleDTO, error) {
	if _, err := uc.groupRepo.GetGroupByID(ctx, groupID, orgID); err != nil {
		return nil, err
	}
	schedules, err := uc.groupRepo.ListSchedulesByGroup(ctx, groupID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.GroupScheduleDTO, len(schedules))
	for i, s := range schedules {
		result[i] = *toGroupScheduleDTO(&s)
	}
	return result, nil
}

func (uc *GroupUseCase) DeleteSchedule(ctx context.Context, schedID, groupID, orgID uuid.UUID) error {
	if _, err := uc.groupRepo.GetGroupByID(ctx, groupID, orgID); err != nil {
		return err
	}
	return uc.groupRepo.DeleteSchedule(ctx, schedID, groupID)
}

func (uc *GroupUseCase) AddMember(ctx context.Context, groupID, orgID uuid.UUID, req dto.AddMemberRequest) (*dto.GroupMemberDTO, error) {
	g, err := uc.groupRepo.GetGroupByID(ctx, groupID, orgID)
	if err != nil {
		return nil, err
	}
	studentID, err := uuid.Parse(req.StudentID)
	if err != nil {
		return nil, apperrors.ValidationError("invalid student_id")
	}
	// Enforce: student may only belong to one group per course (only when group is assigned to a course)
	if g.CourseID != nil {
		existing, _ := uc.groupRepo.GetStudentGroup(ctx, *g.CourseID, studentID, orgID)
		if existing != nil {
			return nil, apperrors.ConflictError("student is already in a group for this course")
		}
	}
	m := &entities.GroupMember{
		ID:        uuid.New(),
		GroupID:   groupID,
		StudentID: studentID,
		OrgID:     orgID,
		JoinedAt:  time.Now(),
	}
	if err := uc.groupRepo.AddMember(ctx, m); err != nil {
		return nil, err
	}
	return toGroupMemberDTO(m), nil
}

func (uc *GroupUseCase) RemoveMember(ctx context.Context, groupID, studentID, orgID uuid.UUID) error {
	if _, err := uc.groupRepo.GetGroupByID(ctx, groupID, orgID); err != nil {
		return err
	}
	return uc.groupRepo.RemoveMember(ctx, groupID, studentID)
}

func (uc *GroupUseCase) ListMembers(ctx context.Context, groupID, orgID uuid.UUID) ([]dto.GroupMemberDTO, error) {
	if _, err := uc.groupRepo.GetGroupByID(ctx, groupID, orgID); err != nil {
		return nil, err
	}
	members, err := uc.groupRepo.ListMembers(ctx, groupID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.GroupMemberDTO, len(members))
	for i, m := range members {
		result[i] = *toGroupMemberDTO(&m)
	}
	return result, nil
}

func (uc *GroupUseCase) GetStudentGroup(ctx context.Context, courseID, studentID, orgID uuid.UUID) (*dto.GroupDTO, error) {
	g, err := uc.groupRepo.GetStudentGroup(ctx, courseID, studentID, orgID)
	if err != nil {
		return nil, err
	}
	return toGroupDTO(g), nil
}

func toGroupDTO(g *entities.Group) *dto.GroupDTO {
	d := &dto.GroupDTO{
		ID:        g.ID.String(),
		OrgID:     g.OrgID.String(),
		Name:      g.Name,
		CreatedAt: g.CreatedAt,
		UpdatedAt: g.UpdatedAt,
	}
	if g.CourseID != nil {
		s := g.CourseID.String()
		d.CourseID = &s
	}
	if g.TeacherID != nil {
		s := g.TeacherID.String()
		d.TeacherID = &s
	}
	return d
}

func toGroupScheduleDTO(s *entities.GroupSchedule) *dto.GroupScheduleDTO {
	return &dto.GroupScheduleDTO{
		ID:        s.ID.String(),
		GroupID:   s.GroupID.String(),
		DayOfWeek: s.DayOfWeek,
		StartTime: s.StartTime,
		EndTime:   s.EndTime,
		Location:  s.Location,
		CreatedAt: s.CreatedAt,
	}
}

func toGroupMemberDTO(m *entities.GroupMember) *dto.GroupMemberDTO {
	return &dto.GroupMemberDTO{
		ID:        m.ID.String(),
		GroupID:   m.GroupID.String(),
		StudentID: m.StudentID.String(),
		OrgID:     m.OrgID.String(),
		JoinedAt:  m.JoinedAt,
	}
}
