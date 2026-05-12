# Appendix A — Source Code Listings

---

## Figure A.1: frontend/src/app/page.tsx — Landing Page Component

```tsx
import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { SocialProof } from '@/components/landing/SocialProof'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#FAFAF8] overflow-x-hidden"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <LandingNav />
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <PricingSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  )
}
```

---

## Figure A.2: frontend/package.json

```json
{
  "name": "mentra-lms-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "dependencies": {
    "@dnd-kit/core": "^6",
    "@dnd-kit/sortable": "^8",
    "@hookform/resolvers": "^3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-tabs": "^1.1.13",
    "@tanstack/react-query": "^5",
    "framer-motion": "^11",
    "lucide-react": "latest",
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "react-hook-form": "^7",
    "recharts": "^2",
    "tailwindcss": "^3",
    "typescript": "^5",
    "zod": "^3",
    "zustand": "^5"
  },
  "devDependencies": {
    "@playwright/test": "^1.58.2",
    "@types/node": "^22",
    "@types/react": "^19",
    "axios": "^1.13.6"
  }
}
```

---

## Figure A.3: backend/go.mod

```
module github.com/ailms/backend

go 1.23

require (
    github.com/gin-gonic/gin v1.10.0
    github.com/go-playground/validator/v10 v10.22.0
    github.com/golang-jwt/jwt/v5 v5.2.1
    github.com/google/uuid v1.6.0
    github.com/joho/godotenv v1.5.1
    github.com/stretchr/testify v1.11.1
    golang.org/x/crypto v0.31.0
    gorm.io/driver/postgres v1.6.0
    gorm.io/gorm v1.31.1
)
```

---

## Figure A.4: backend/internal/delivery/http/routes/router.go

```go
package routes

import (
    "github.com/ailms/backend/internal/delivery/http/handlers"
    "github.com/ailms/backend/internal/delivery/http/middleware"
    "github.com/ailms/backend/internal/domain/entities"
    "github.com/gin-gonic/gin"
)

func NewRouter(deps Dependencies) *gin.Engine {
    r := gin.New()
    r.Use(
        middleware.CORS(),
        middleware.RequestLogger(deps.Logger),
        middleware.ErrorHandler(),
        middleware.RateLimiter(100),
    )

    api := r.Group("/api/v1")

    // Super admin public login — no tenant middleware
    api.POST("/super-admin/auth/login", deps.SuperAdminHandler.Login)

    // Super admin protected routes
    sa := api.Group("/super-admin")
    sa.Use(middleware.Auth(deps.JWTSecret), middleware.RequireRole(entities.RoleSuperAdmin))
    sa.GET("/stats", deps.SuperAdminHandler.GetStats)
    sa.GET("/orgs", deps.SuperAdminHandler.ListOrgs)
    sa.POST("/orgs/invite-admin", deps.SuperAdminHandler.InviteOrgAdmin)

    // Public auth routes
    auth := api.Group("/auth")
    auth.POST("/register", deps.AuthHandler.Register)
    auth.POST("/login", deps.AuthHandler.Login)

    // Protected routes — require JWT + resolved org tenant
    protected := api.Group("/")
    protected.Use(
        middleware.Auth(deps.JWTSecret),
        middleware.Tenant(deps.OrgRepo),
    )

    // Courses
    courses := protected.Group("/courses")
    courses.GET("", deps.CourseHandler.List)
    courses.GET("/:id", deps.CourseHandler.Get)
    courses.POST("",
        middleware.RequireRole(entities.RoleTeacher, entities.RoleAdmin),
        deps.CourseHandler.Create,
    )
    courses.PUT("/:id",
        middleware.RequireRole(entities.RoleTeacher, entities.RoleAdmin),
        deps.CourseHandler.Update,
    )
    courses.DELETE("/:id",
        middleware.RequireRole(entities.RoleAdmin),
        deps.CourseHandler.Delete,
    )

    // Modules (nested under courses)
    courses.GET("/:id/modules", deps.ModuleHandler.List)
    courses.POST("/:id/modules",
        middleware.RequireRole(entities.RoleTeacher, entities.RoleAdmin),
        deps.ModuleHandler.Create,
    )

    // Lessons (nested under modules)
    lessons := protected.Group("/modules/:moduleID/lessons")
    lessons.GET("", deps.LessonHandler.List)
    lessons.POST("",
        middleware.RequireRole(entities.RoleTeacher, entities.RoleAdmin),
        deps.LessonHandler.Create,
    )
    lessons.GET("/:lessonID", deps.LessonHandler.Get)

    // Progress
    progress := protected.Group("/progress")
    progress.GET("", deps.ProgressHandler.GetProgress)
    progress.GET("/insights", deps.ProgressHandler.GetInsights)
    progress.POST("/lessons/:lessonID/complete", deps.ProgressHandler.Complete)

    // AI (teacher/admin only)
    ai := protected.Group("/ai")
    ai.Use(middleware.RequireRole(entities.RoleTeacher, entities.RoleAdmin))
    ai.POST("/summarize", deps.AIHandler.SummarizeLesson)
    ai.POST("/generate-quiz", deps.AIHandler.GenerateQuiz)

    // Static file serving
    if deps.UploadDir != "" {
        r.Static("/uploads", deps.UploadDir)
    }

    return r
}
```

---

## Figure A.5: backend/internal/domain/entities/user.go

```go
package entities

import (
    "time"

    "github.com/google/uuid"
    "golang.org/x/crypto/bcrypt"
)

type Role string

const (
    RoleSuperAdmin Role = "super_admin"
    RoleAdmin      Role = "admin"
    RoleTeacher    Role = "teacher"
    RoleStudent    Role = "student"
)

type User struct {
    ID           uuid.UUID
    Email        string
    PasswordHash string
    Name         string
    Role         string
    CreatedAt    time.Time
    UpdatedAt    time.Time
}

func (u *User) ValidatePassword(plain string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(plain))
    return err == nil
}
```

---

## Figure A.6: backend/internal/infrastructure/config/config.go

```go
package config

import (
    "fmt"
    "os"
    "strconv"

    "github.com/joho/godotenv"
)

type Config struct {
    Server     ServerConfig
    Database   DatabaseConfig
    JWT        JWTConfig
    Ollama     OllamaConfig
    SuperAdmin SuperAdminConfig
}

type ServerConfig struct {
    Port string
    Mode string
}

type DatabaseConfig struct {
    DSN          string
    MaxOpenConns int
    MaxIdleConns int
}

type JWTConfig struct {
    Secret                string
    AccessTokenTTLMinutes int
}

type OllamaConfig struct {
    BaseURL        string
    Model          string
    TimeoutSeconds int
}

func Load() (*Config, error) {
    _ = godotenv.Load()

    cfg := &Config{
        Server: ServerConfig{
            Port: getEnv("SERVER_PORT", "8080"),
            Mode: getEnv("SERVER_MODE", "debug"),
        },
        Database: DatabaseConfig{
            DSN:          mustGetEnv("DB_DSN"),
            MaxOpenConns: getEnvInt("DB_MAX_OPEN_CONNS", 25),
            MaxIdleConns: getEnvInt("DB_MAX_IDLE_CONNS", 10),
        },
        JWT: JWTConfig{
            Secret:                mustGetEnv("JWT_SECRET"),
            AccessTokenTTLMinutes: getEnvInt("JWT_ACCESS_TOKEN_TTL_MINUTES", 15),
        },
        Ollama: OllamaConfig{
            BaseURL:        getEnv("OLLAMA_BASE_URL", "http://localhost:11434"),
            Model:          getEnv("OLLAMA_MODEL", "llama3.2"),
            TimeoutSeconds: getEnvInt("OLLAMA_TIMEOUT_SECONDS", 60),
        },
    }
    return cfg, nil
}

func getEnv(key, defaultVal string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return defaultVal
}

func mustGetEnv(key string) string {
    v := os.Getenv(key)
    if v == "" {
        panic(fmt.Sprintf("required environment variable %s is not set", key))
    }
    return v
}

func getEnvInt(key string, defaultVal int) int {
    if v := os.Getenv(key); v != "" {
        if i, err := strconv.Atoi(v); err == nil {
            return i
        }
    }
    return defaultVal
}
```

---

## Figure A.7: backend/internal/delivery/http/middleware/auth.go

```go
package middleware

import (
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
    apperrors "github.com/ailms/backend/pkg/errors"
)

func Auth(jwtSecret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.Error(apperrors.UnauthorizedError("missing authorization header"))
            c.Abort()
            return
        }

        parts := strings.SplitN(authHeader, " ", 2)
        if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
            c.Error(apperrors.UnauthorizedError("invalid authorization header format"))
            c.Abort()
            return
        }

        token, err := jwt.Parse(parts[1], func(token *jwt.Token) (interface{}, error) {
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, apperrors.UnauthorizedError("unexpected signing method")
            }
            return []byte(jwtSecret), nil
        })
        if err != nil || !token.Valid {
            c.Error(apperrors.UnauthorizedError("invalid or expired token"))
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            c.Error(apperrors.UnauthorizedError("invalid token claims"))
            c.Abort()
            return
        }

        c.Set(string(ContextKeyUserID), claims["user_id"])
        c.Set(string(ContextKeyOrgID), claims["org_id"])
        c.Set(string(ContextKeyRole), claims["role"])
        c.Next()
    }
}

func GetUserID(c *gin.Context) string {
    v, _ := c.Get(string(ContextKeyUserID))
    s, _ := v.(string)
    return s
}

func GetOrgID(c *gin.Context) string {
    v, _ := c.Get(string(ContextKeyOrgID))
    s, _ := v.(string)
    return s
}

func GetRole(c *gin.Context) string {
    v, _ := c.Get(string(ContextKeyRole))
    s, _ := v.(string)
    return s
}
```

---

## Figure A.8: backend/internal/infrastructure/storage/local_storage.go

```go
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

func (s *LocalStorage) Save(
    file multipart.File,
    header *multipart.FileHeader,
    orgID string,
) (string, error) {
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

    return filepath.Join("uploads", orgID, storedName), nil
}
```

---

## Figure A.9: backend/internal/application/usecases/auth_usecase.go

```go
package usecases

import (
    "context"
    "time"

    "github.com/ailms/backend/internal/application/dto"
    "github.com/ailms/backend/internal/domain/entities"
    "github.com/ailms/backend/internal/domain/repositories"
    apperrors "github.com/ailms/backend/pkg/errors"
    "github.com/golang-jwt/jwt/v5"
    "github.com/google/uuid"
    "golang.org/x/crypto/bcrypt"
)

type AuthUseCase struct {
    userRepo   repositories.UserRepository
    orgRepo    repositories.OrganizationRepository
    memberRepo repositories.MembershipRepository
    jwtSecret  string
}

func (uc *AuthUseCase) Login(
    ctx context.Context,
    req dto.LoginRequest,
    orgSlug string,
) (*dto.TokenResponse, error) {
    user, err := uc.userRepo.FindByEmail(ctx, req.Email)
    if err != nil {
        return nil, apperrors.UnauthorizedError("invalid credentials")
    }

    if !user.ValidatePassword(req.Password) {
        return nil, apperrors.UnauthorizedError("invalid credentials")
    }

    org, err := uc.orgRepo.FindBySlug(ctx, orgSlug)
    if err != nil {
        return nil, apperrors.NotFoundError("organization", orgSlug)
    }

    role, err := uc.memberRepo.FindUserRole(ctx, user.ID, org.ID)
    if err != nil {
        return nil, apperrors.ForbiddenError("user is not a member of this organization")
    }

    return uc.generateToken(user, org.ID, role)
}

func (uc *AuthUseCase) generateToken(
    user *entities.User,
    orgID uuid.UUID,
    role entities.Role,
) (*dto.TokenResponse, error) {
    expiresAt := time.Now().Add(15 * time.Minute)
    claims := jwt.MapClaims{
        "user_id": user.ID.String(),
        "org_id":  orgID.String(),
        "role":    string(role),
        "exp":     expiresAt.Unix(),
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    signed, err := token.SignedString([]byte(uc.jwtSecret))
    if err != nil {
        return nil, apperrors.InternalError("failed to sign token")
    }
    return &dto.TokenResponse{
        AccessToken: signed,
        ExpiresAt:   expiresAt,
        User: dto.UserDTO{
            ID:    user.ID.String(),
            Email: user.Email,
            Name:  user.Name,
        },
    }, nil
}
```

---

## Figure A.10: backend/internal/infrastructure/ai/ollama_client.go

```go
package ai

import (
    "bytes"
    "context"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"

    "github.com/ailms/backend/internal/infrastructure/config"
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
    reqBody := ollamaRequest{Model: c.model, Prompt: prompt, Stream: false}
    data, _ := json.Marshal(reqBody)

    req, err := http.NewRequestWithContext(
        ctx, http.MethodPost, c.baseURL+"/api/generate", bytes.NewReader(data),
    )
    if err != nil {
        return "", fmt.Errorf("failed to create request: %w", err)
    }
    req.Header.Set("Content-Type", "application/json")

    resp, err := c.httpClient.Do(req)
    if err != nil {
        return "", fmt.Errorf("ollama request failed: %w", err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    var ollamaResp ollamaResponse
    if err := json.Unmarshal(body, &ollamaResp); err != nil {
        return "", fmt.Errorf("failed to parse response: %w", err)
    }
    return ollamaResp.Response, nil
}

func (c *OllamaClient) GenerateLessonSummary(ctx context.Context, content string) (string, error) {
    prompt := fmt.Sprintf(
        "Summarize the following lesson content in 2-3 concise paragraphs:\n\n%s\n\n"+
            "Provide only the summary, no additional commentary.", content,
    )
    return c.generate(ctx, prompt)
}

func (c *OllamaClient) GenerateRemediation(
    ctx context.Context,
    lessonContent string,
    wrongQuestions []string,
) (string, error) {
    questionsText := ""
    for i, q := range wrongQuestions {
        questionsText += fmt.Sprintf("%d. %s\n", i+1, q)
    }
    prompt := fmt.Sprintf(
        "A student answered the following quiz questions incorrectly:\n\n%s\n"+
            "Lesson content they studied:\n%s\n\n"+
            "In 2-3 sentences, explain which concepts to review and how to approach them.",
        questionsText, lessonContent,
    )
    return c.generate(ctx, prompt)
}
```

---

## Figure A.11: frontend/src/middleware.ts — Route Guard

```ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Super admin routes — guard before org regex
  if (pathname.startsWith('/super-admin')) {
    const roleCookie = request.cookies.get('mentra-role')?.value
    if (roleCookie !== 'super_admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  const orgMatch = pathname.match(/^\/([^/]+)\/(.+)/)
  if (!orgMatch) return NextResponse.next()

  const [, orgSlug, rest] = orgMatch
  const roleCookie = request.cookies.get('mentra-role')?.value
  const orgCookie = request.cookies.get('mentra-org')?.value

  if (rest === 'login') return NextResponse.next()

  if (!roleCookie) {
    const loginUrl = new URL(`/${orgSlug}/login`, request.url)
    loginUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = roleCookie as string
  const isAdminPath = rest.startsWith('admin')
  const isTeacherPath = rest.startsWith('teacher')
  const isStudentPath = rest.startsWith('student')

  const adminRoles = ['admin', 'super_admin']
  const teacherRoles = ['teacher', 'admin', 'super_admin']
  const studentRoles = ['student', 'admin', 'super_admin']

  let correctBasePath: string | null = null

  if (isAdminPath && !adminRoles.includes(role)) {
    correctBasePath = getCorrectPath(role)
  } else if (isTeacherPath && !teacherRoles.includes(role)) {
    correctBasePath = getCorrectPath(role)
  } else if (isStudentPath && !studentRoles.includes(role)) {
    correctBasePath = getCorrectPath(role)
  }

  if (correctBasePath !== null) {
    const correctOrg = orgCookie ?? orgSlug
    return NextResponse.redirect(new URL(`/${correctOrg}/${correctBasePath}`, request.url))
  }

  return NextResponse.next()
}

function getCorrectPath(role: string): string {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return 'admin'
    case 'teacher':
      return 'teacher'
    default:
      return 'student'
  }
}

export const config = {
  matcher: ['/((?!api|_next|login|register|$).*)'],
}
```

---

## Figure A.12: frontend/src/lib/api/client.ts — Axios API Client

```ts
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/lib/stores/auth.store'
import { useReAuthStore } from '@/lib/stores/reauth.store'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'

export const UPLOAD_BASE_URL = API_URL.replace(/\/api\/v\d+$/, '')

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

let pendingRequests: Array<{
  resolve: (value: string) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(token: string | null, error?: unknown) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (token) resolve(token)
    else reject(error)
  })
  pendingRequests = []
}

// Attach Authorization header and X-Org-Slug on every request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { token, orgSlug } = useAuthStore.getState()
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  if (orgSlug) config.headers['X-Org-Slug'] = orgSlug
  return config
})

// Unwrap { data: ... } envelope; trigger re-auth modal on 401
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && 'data' in response.data) {
      if (!('meta' in response.data)) {
        response.data = response.data.data
      }
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { user } = useAuthStore.getState()

      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject })
        useReAuthStore.getState().open(user?.email ?? '', {
          onSuccess: (newToken: string) => {
            processQueue(newToken)
            ;(originalRequest.headers as Record<string, string>)[
              'Authorization'
            ] = `Bearer ${newToken}`
            resolve(apiClient(originalRequest))
          },
          onCancel: () => {
            processQueue(null, new Error('Re-authentication cancelled'))
            reject(error)
          },
        })
      })
    }

    return Promise.reject(error)
  }
)
```
