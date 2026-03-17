package usecases

import (
	"context"
	"net/http"
	"testing"
	"time"

	"github.com/ailms/backend/internal/application/dto"
	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/mocks"
	apperrors "github.com/ailms/backend/pkg/errors"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"golang.org/x/crypto/bcrypt"
)

func newAuthUC(userRepo *mocks.MockUserRepository, orgRepo *mocks.MockOrganizationRepository, memberRepo *mocks.MockMembershipRepository) *AuthUseCase {
	uc := NewAuthUseCase(userRepo, orgRepo, memberRepo, "test-secret")
	uc.bcryptCost = bcrypt.MinCost
	return uc
}

func TestAuthUseCase_Register_Success(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	req := dto.RegisterRequest{
		Email:    "admin@test.com",
		Password: "password123",
		Name:     "Admin",
		OrgName:  "Test Org",
		OrgSlug:  "testorg",
	}

	userRepo.On("FindByEmail", mock.Anything, req.Email).Return(nil, apperrors.NotFoundError("user", ""))
	orgRepo.On("FindBySlug", mock.Anything, req.OrgSlug).Return(nil, apperrors.NotFoundError("organization", ""))
	userRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.User")).Return(nil)
	orgRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.Organization")).Return(nil)
	memberRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.Membership")).Return(nil)

	resp, err := uc.Register(context.Background(), req)
	require.NoError(t, err)
	require.NotNil(t, resp)
	assert.NotEmpty(t, resp.AccessToken)
	assert.Equal(t, req.Email, resp.User.Email)

	// Verify JWT claims contain role=admin
	token, _ := jwt.Parse(resp.AccessToken, func(t *jwt.Token) (interface{}, error) {
		return []byte("test-secret"), nil
	})
	claims := token.Claims.(jwt.MapClaims)
	assert.Equal(t, string(entities.RoleAdmin), claims["role"])
}

func TestAuthUseCase_Register_DuplicateEmail(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	existing := makeUser("admin@test.com", "pass", entities.RoleAdmin)
	userRepo.On("FindByEmail", mock.Anything, "admin@test.com").Return(existing, nil)

	_, err := uc.Register(context.Background(), dto.RegisterRequest{Email: "admin@test.com", Password: "pass", OrgSlug: "org"})
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusConflict, appErr.HTTPStatus)
}

func TestAuthUseCase_Register_DuplicateOrgSlug(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	userRepo.On("FindByEmail", mock.Anything, "new@test.com").Return(nil, apperrors.NotFoundError("user", ""))
	existingOrg := &entities.Organization{ID: uuid.New(), Slug: "taken"}
	orgRepo.On("FindBySlug", mock.Anything, "taken").Return(existingOrg, nil)

	_, err := uc.Register(context.Background(), dto.RegisterRequest{Email: "new@test.com", Password: "pass", OrgSlug: "taken"})
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusConflict, appErr.HTTPStatus)
}

func TestAuthUseCase_Register_PasswordIsHashed(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	plainPassword := "mysecretpassword"
	req := dto.RegisterRequest{
		Email: "user@test.com", Password: plainPassword, Name: "U", OrgName: "O", OrgSlug: "o",
	}

	var capturedUser *entities.User
	userRepo.On("FindByEmail", mock.Anything, req.Email).Return(nil, apperrors.NotFoundError("user", ""))
	orgRepo.On("FindBySlug", mock.Anything, req.OrgSlug).Return(nil, apperrors.NotFoundError("org", ""))
	userRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.User")).Run(func(args mock.Arguments) {
		capturedUser = args.Get(1).(*entities.User)
	}).Return(nil)
	orgRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.Organization")).Return(nil)
	memberRepo.On("Create", mock.Anything, mock.AnythingOfType("*entities.Membership")).Return(nil)

	_, err := uc.Register(context.Background(), req)
	require.NoError(t, err)
	require.NotNil(t, capturedUser)
	assert.NotEqual(t, plainPassword, capturedUser.PasswordHash)
	assert.NoError(t, bcrypt.CompareHashAndPassword([]byte(capturedUser.PasswordHash), []byte(plainPassword)))
}

func TestAuthUseCase_Login_Success(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	user := makeUser("user@test.com", "password123", entities.RoleStudent)
	org := &entities.Organization{ID: uuid.New(), Slug: "myorg"}

	userRepo.On("FindByEmail", mock.Anything, "user@test.com").Return(user, nil)
	orgRepo.On("FindBySlug", mock.Anything, "myorg").Return(org, nil)
	memberRepo.On("FindUserRole", mock.Anything, user.ID, org.ID).Return(entities.RoleStudent, nil)

	resp, err := uc.Login(context.Background(), dto.LoginRequest{Email: "user@test.com", Password: "password123"}, "myorg")
	require.NoError(t, err)
	require.NotNil(t, resp)

	token, _ := jwt.Parse(resp.AccessToken, func(t *jwt.Token) (interface{}, error) {
		return []byte("test-secret"), nil
	})
	claims := token.Claims.(jwt.MapClaims)
	assert.Equal(t, user.ID.String(), claims["user_id"])
	assert.Equal(t, org.ID.String(), claims["org_id"])
	assert.Equal(t, string(entities.RoleStudent), claims["role"])
	assert.True(t, resp.ExpiresAt.After(time.Now()))
}

func TestAuthUseCase_Login_EmailNotFound(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	userRepo.On("FindByEmail", mock.Anything, "nobody@test.com").Return(nil, apperrors.NotFoundError("user", ""))

	_, err := uc.Login(context.Background(), dto.LoginRequest{Email: "nobody@test.com", Password: "pass"}, "org")
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusUnauthorized, appErr.HTTPStatus)
}

func TestAuthUseCase_Login_WrongPassword(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	user := makeUser("user@test.com", "correctpass", entities.RoleStudent)
	userRepo.On("FindByEmail", mock.Anything, "user@test.com").Return(user, nil)

	_, err := uc.Login(context.Background(), dto.LoginRequest{Email: "user@test.com", Password: "wrongpass"}, "org")
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusUnauthorized, appErr.HTTPStatus)
}

func TestAuthUseCase_Login_OrgNotFound(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	user := makeUser("user@test.com", "password", entities.RoleStudent)
	userRepo.On("FindByEmail", mock.Anything, "user@test.com").Return(user, nil)
	orgRepo.On("FindBySlug", mock.Anything, "missing").Return(nil, apperrors.NotFoundError("organization", "missing"))

	_, err := uc.Login(context.Background(), dto.LoginRequest{Email: "user@test.com", Password: "password"}, "missing")
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusNotFound, appErr.HTTPStatus)
}

func TestAuthUseCase_Login_NotMember(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	user := makeUser("user@test.com", "password", entities.RoleStudent)
	org := &entities.Organization{ID: uuid.New(), Slug: "org"}
	userRepo.On("FindByEmail", mock.Anything, "user@test.com").Return(user, nil)
	orgRepo.On("FindBySlug", mock.Anything, "org").Return(org, nil)
	memberRepo.On("FindUserRole", mock.Anything, user.ID, org.ID).Return(entities.Role(""), apperrors.NotFoundError("membership", ""))

	_, err := uc.Login(context.Background(), dto.LoginRequest{Email: "user@test.com", Password: "password"}, "org")
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusForbidden, appErr.HTTPStatus)
}

func TestAuthUseCase_SuperAdminLogin_Success(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	user := makeUser("sa@test.com", "password", entities.RoleSuperAdmin)
	userRepo.On("FindByEmail", mock.Anything, "sa@test.com").Return(user, nil)

	resp, err := uc.SuperAdminLogin(context.Background(), dto.LoginRequest{Email: "sa@test.com", Password: "password"})
	require.NoError(t, err)
	require.NotNil(t, resp)

	token, _ := jwt.Parse(resp.AccessToken, func(t *jwt.Token) (interface{}, error) {
		return []byte("test-secret"), nil
	})
	claims := token.Claims.(jwt.MapClaims)
	assert.Equal(t, uuid.Nil.String(), claims["org_id"])
	assert.Equal(t, string(entities.RoleSuperAdmin), claims["role"])
}

func TestAuthUseCase_SuperAdminLogin_NotSuperAdmin(t *testing.T) {
	userRepo := new(mocks.MockUserRepository)
	orgRepo := new(mocks.MockOrganizationRepository)
	memberRepo := new(mocks.MockMembershipRepository)
	uc := newAuthUC(userRepo, orgRepo, memberRepo)

	user := makeUser("teacher@test.com", "password", entities.RoleTeacher)
	userRepo.On("FindByEmail", mock.Anything, "teacher@test.com").Return(user, nil)

	_, err := uc.SuperAdminLogin(context.Background(), dto.LoginRequest{Email: "teacher@test.com", Password: "password"})
	require.Error(t, err)
	var appErr *apperrors.AppError
	require.ErrorAs(t, err, &appErr)
	assert.Equal(t, http.StatusForbidden, appErr.HTTPStatus)
}
