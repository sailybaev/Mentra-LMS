package repositories

import (
	"context"
	"time"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/infrastructure/database"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GORMGroupRepository struct {
	db *gorm.DB
}

func NewGORMGroupRepository(db *gorm.DB) *GORMGroupRepository {
	return &GORMGroupRepository{db: db}
}

func (r *GORMGroupRepository) CreateGroup(ctx context.Context, g *entities.Group) error {
	return r.db.WithContext(ctx).Create(toGroupModel(g)).Error
}

func (r *GORMGroupRepository) GetGroupByID(ctx context.Context, id, orgID uuid.UUID) (*entities.Group, error) {
	var model database.GroupModel
	err := r.db.WithContext(ctx).First(&model, "id = ? AND org_id = ?", id.String(), orgID.String()).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("group", id.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	return toGroupEntity(&model), nil
}

func (r *GORMGroupRepository) ListGroupsByCourse(ctx context.Context, courseID, orgID uuid.UUID) ([]entities.Group, error) {
	var models []database.GroupModel
	err := r.db.WithContext(ctx).Where("course_id = ? AND org_id = ?", courseID.String(), orgID.String()).
		Order("created_at ASC").Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]entities.Group, len(models))
	for i, m := range models {
		result[i] = *toGroupEntity(&m)
	}
	return result, nil
}

func (r *GORMGroupRepository) ListGroupsByOrg(ctx context.Context, orgID uuid.UUID) ([]entities.Group, error) {
	var models []database.GroupModel
	err := r.db.WithContext(ctx).Where("org_id = ?", orgID.String()).
		Order("created_at ASC").Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]entities.Group, len(models))
	for i, m := range models {
		result[i] = *toGroupEntity(&m)
	}
	return result, nil
}

func (r *GORMGroupRepository) AssignToCourse(ctx context.Context, groupID, courseID, orgID uuid.UUID) error {
	courseIDStr := courseID.String()
	result := r.db.WithContext(ctx).Model(&database.GroupModel{}).
		Where("id = ? AND org_id = ?", groupID.String(), orgID.String()).
		Update("course_id", courseIDStr)
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("group", groupID.String())
	}
	return nil
}

func (r *GORMGroupRepository) UnassignFromCourse(ctx context.Context, groupID, orgID uuid.UUID) error {
	result := r.db.WithContext(ctx).Model(&database.GroupModel{}).
		Where("id = ? AND org_id = ?", groupID.String(), orgID.String()).
		Update("course_id", nil)
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("group", groupID.String())
	}
	return nil
}

func (r *GORMGroupRepository) UpdateGroup(ctx context.Context, g *entities.Group) error {
	g.UpdatedAt = time.Now()
	return r.db.WithContext(ctx).Save(toGroupModel(g)).Error
}

func (r *GORMGroupRepository) DeleteGroup(ctx context.Context, id, orgID uuid.UUID) error {
	result := r.db.WithContext(ctx).Where("id = ? AND org_id = ?", id.String(), orgID.String()).Delete(&database.GroupModel{})
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("group", id.String())
	}
	return nil
}

func (r *GORMGroupRepository) AddSchedule(ctx context.Context, s *entities.GroupSchedule) error {
	return r.db.WithContext(ctx).Create(toGroupScheduleModel(s)).Error
}

func (r *GORMGroupRepository) ListSchedulesByGroup(ctx context.Context, groupID uuid.UUID) ([]entities.GroupSchedule, error) {
	var models []database.GroupScheduleModel
	err := r.db.WithContext(ctx).Where("group_id = ?", groupID.String()).
		Order("day_of_week ASC, start_time ASC").Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]entities.GroupSchedule, len(models))
	for i, m := range models {
		result[i] = *toGroupScheduleEntity(&m)
	}
	return result, nil
}

func (r *GORMGroupRepository) DeleteSchedule(ctx context.Context, id, groupID uuid.UUID) error {
	result := r.db.WithContext(ctx).Where("id = ? AND group_id = ?", id.String(), groupID.String()).Delete(&database.GroupScheduleModel{})
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return apperrors.NotFoundError("schedule", id.String())
	}
	return nil
}

func (r *GORMGroupRepository) AddMember(ctx context.Context, m *entities.GroupMember) error {
	return r.db.WithContext(ctx).Create(toGroupMemberModel(m)).Error
}

func (r *GORMGroupRepository) RemoveMember(ctx context.Context, groupID, studentID uuid.UUID) error {
	result := r.db.WithContext(ctx).Where("group_id = ? AND student_id = ?", groupID.String(), studentID.String()).Delete(&database.GroupMemberModel{})
	if result.Error != nil {
		return apperrors.InternalError(result.Error.Error())
	}
	return nil
}

func (r *GORMGroupRepository) ListMembers(ctx context.Context, groupID uuid.UUID) ([]entities.GroupMember, error) {
	var models []database.GroupMemberModel
	err := r.db.WithContext(ctx).Where("group_id = ?", groupID.String()).
		Order("joined_at ASC").Find(&models).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	result := make([]entities.GroupMember, len(models))
	for i, m := range models {
		result[i] = *toGroupMemberEntity(&m)
	}
	return result, nil
}

func (r *GORMGroupRepository) GetStudentGroup(ctx context.Context, courseID, studentID, orgID uuid.UUID) (*entities.Group, error) {
	var member database.GroupMemberModel
	err := r.db.WithContext(ctx).
		Joins("JOIN groups ON groups.id = group_members.group_id").
		Where("group_members.student_id = ? AND groups.course_id = ? AND groups.org_id = ?",
			studentID.String(), courseID.String(), orgID.String()).
		First(&member).Error
	if err == gorm.ErrRecordNotFound {
		return nil, apperrors.NotFoundError("group", studentID.String())
	}
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	groupID, _ := uuid.Parse(member.GroupID)
	return r.GetGroupByID(ctx, groupID, orgID)
}

func (r *GORMGroupRepository) FindCourseIDsByStudent(ctx context.Context, studentID, orgID uuid.UUID) ([]uuid.UUID, error) {
	type row struct {
		CourseID string
	}
	var rows []row
	err := r.db.WithContext(ctx).Raw(
		`SELECT DISTINCT g.course_id FROM groups g
		 JOIN group_members gm ON gm.group_id = g.id
		 WHERE gm.student_id = ? AND g.org_id = ? AND g.course_id IS NOT NULL`,
		studentID.String(), orgID.String(),
	).Scan(&rows).Error
	if err != nil {
		return nil, apperrors.InternalError(err.Error())
	}
	ids := make([]uuid.UUID, 0, len(rows))
	for _, r := range rows {
		if id, err := uuid.Parse(r.CourseID); err == nil {
			ids = append(ids, id)
		}
	}
	return ids, nil
}

func toGroupModel(g *entities.Group) *database.GroupModel {
	m := &database.GroupModel{
		ID:        g.ID.String(),
		OrgID:     g.OrgID.String(),
		Name:      g.Name,
		CreatedAt: g.CreatedAt,
		UpdatedAt: g.UpdatedAt,
	}
	if g.CourseID != nil {
		s := g.CourseID.String()
		m.CourseID = &s
	}
	if g.TeacherID != nil {
		s := g.TeacherID.String()
		m.TeacherID = &s
	}
	return m
}

func toGroupEntity(m *database.GroupModel) *entities.Group {
	id, _ := uuid.Parse(m.ID)
	orgID, _ := uuid.Parse(m.OrgID)
	g := &entities.Group{
		ID:        id,
		OrgID:     orgID,
		Name:      m.Name,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
	if m.CourseID != nil {
		courseID, _ := uuid.Parse(*m.CourseID)
		g.CourseID = &courseID
	}
	if m.TeacherID != nil {
		tid, _ := uuid.Parse(*m.TeacherID)
		g.TeacherID = &tid
	}
	return g
}

func toGroupScheduleModel(s *entities.GroupSchedule) *database.GroupScheduleModel {
	return &database.GroupScheduleModel{
		ID:        s.ID.String(),
		GroupID:   s.GroupID.String(),
		DayOfWeek: s.DayOfWeek,
		StartTime: s.StartTime,
		EndTime:   s.EndTime,
		Location:  s.Location,
		CreatedAt: s.CreatedAt,
	}
}

func toGroupScheduleEntity(m *database.GroupScheduleModel) *entities.GroupSchedule {
	id, _ := uuid.Parse(m.ID)
	groupID, _ := uuid.Parse(m.GroupID)
	return &entities.GroupSchedule{
		ID:        id,
		GroupID:   groupID,
		DayOfWeek: m.DayOfWeek,
		StartTime: m.StartTime,
		EndTime:   m.EndTime,
		Location:  m.Location,
		CreatedAt: m.CreatedAt,
	}
}

func toGroupMemberModel(m *entities.GroupMember) *database.GroupMemberModel {
	return &database.GroupMemberModel{
		ID:        m.ID.String(),
		GroupID:   m.GroupID.String(),
		StudentID: m.StudentID.String(),
		OrgID:     m.OrgID.String(),
		JoinedAt:  m.JoinedAt,
	}
}

func toGroupMemberEntity(m *database.GroupMemberModel) *entities.GroupMember {
	id, _ := uuid.Parse(m.ID)
	groupID, _ := uuid.Parse(m.GroupID)
	studentID, _ := uuid.Parse(m.StudentID)
	orgID, _ := uuid.Parse(m.OrgID)
	return &entities.GroupMember{
		ID:        id,
		GroupID:   groupID,
		StudentID: studentID,
		OrgID:     orgID,
		JoinedAt:  m.JoinedAt,
	}
}
