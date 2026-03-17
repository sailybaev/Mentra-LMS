package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/ailms/backend/internal/domain/entities"
	"github.com/ailms/backend/internal/infrastructure/config"
	"github.com/ailms/backend/internal/infrastructure/database"
	infraRepos "github.com/ailms/backend/internal/infrastructure/repositories"
	"github.com/ailms/backend/pkg/logger"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error("failed to load config", "error", err)
		os.Exit(1)
	}

	log := logger.New(slog.LevelInfo, "text")

	db, err := database.NewPostgresDB(cfg.Database)
	if err != nil {
		log.Error("failed to connect to database", "error", err)
		os.Exit(1)
	}
	if err := database.RunMigrations(db); err != nil {
		log.Error("failed to run migrations", "error", err)
		os.Exit(1)
	}

	ctx := context.Background()

	userRepo := infraRepos.NewGORMUserRepository(db)
	orgRepo := infraRepos.NewGORMOrganizationRepository(db)
	memberRepo := infraRepos.NewGORMMembershipRepository(db)
	courseRepo := infraRepos.NewGORMCourseRepository(db)
	moduleRepo := infraRepos.NewGORMModuleRepository(db)
	lessonRepo := infraRepos.NewGORMLessonRepository(db)
	quizRepo := infraRepos.NewGORMQuizRepository(db)
	progressRepo := infraRepos.NewGORMProgressRepository(db)
	courseTeacherRepo := infraRepos.NewGORMCourseTeacherRepository(db)

	now := time.Now()

	// ── Organization ─────────────────────────────────────────────────────────
	org := &entities.Organization{
		ID:        uuid.New(),
		Name:      "Назарбаев Университеті",
		Slug:      "nu",
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := orgRepo.Create(ctx, org); err != nil {
		log.Error("org already exists or failed", "error", err)
		org, err = orgRepo.FindBySlug(ctx, "nu")
		if err != nil {
			log.Error("cannot find org", "error", err)
			os.Exit(1)
		}
	}
	log.Info("org ready", "slug", org.Slug, "id", org.ID)

	// ── Users ─────────────────────────────────────────────────────────────────
	type seedUser struct {
		name  string
		email string
		role  entities.Role
	}
	seedUsers := []seedUser{
		{"Айгерім Бекова", "aiguerim@nu.edu.kz", entities.RoleAdmin},
		{"Бауыржан Сейітов", "baurzhan@nu.edu.kz", entities.RoleTeacher},
		{"Санжар Мұқанов", "sanzhar@nu.edu.kz", entities.RoleStudent},
		{"Жанар Нұрланова", "zhanar@nu.edu.kz", entities.RoleStudent},
	}

	createdUsers := make(map[string]*entities.User, len(seedUsers))
	for _, su := range seedUsers {
		hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.MinCost)
		u := &entities.User{
			ID:           uuid.New(),
			Email:        su.email,
			PasswordHash: string(hash),
			Name:         su.name,
			CreatedAt:    now,
			UpdatedAt:    now,
		}
		if err := userRepo.Create(ctx, u); err != nil {
			log.Info("user exists, loading", "email", su.email)
			u, _ = userRepo.FindByEmail(ctx, su.email)
		}
		createdUsers[su.email] = u
		log.Info("user ready", "email", su.email, "id", u.ID)

		m := &entities.Membership{
			ID:        uuid.New(),
			UserID:    u.ID,
			OrgID:     org.ID,
			Role:      su.role,
			CreatedAt: now,
			UpdatedAt: now,
		}
		if err := memberRepo.Create(ctx, m); err != nil {
			log.Info("membership exists", "email", su.email)
		}
	}

	teacher := createdUsers["baurzhan@nu.edu.kz"]

	// ── Courses ───────────────────────────────────────────────────────────────
	type seedCourse struct {
		title       string
		description string
		status      entities.CourseStatus
	}
	seedCourses := []seedCourse{
		{"Go тіліне кіріспе", "Go тілін нөлден үйреніңіз: типтер, параллельдік және стандартты кітапхана.", entities.StatusPublished},
		{"Gin арқылы веб-әзірлеу", "Gin фреймворкін пайдаланып өндірістік деңгейдегі REST API жасаңыз.", entities.StatusPublished},
		{"Машиналық оқыту негіздері", "МО негіздері: бақылаулы оқыту, нейрондық желілер және бағалау.", entities.StatusDraft},
	}

	createdCourses := make([]*entities.Course, 0, len(seedCourses))
	for _, sc := range seedCourses {
		c := &entities.Course{
			ID:          uuid.New(),
			OrgID:       org.ID,
			Title:       sc.title,
			Description: sc.description,
			Status:      sc.status,
			CreatedBy:   teacher.ID,
			CreatedAt:   now,
			UpdatedAt:   now,
		}
		if err := courseRepo.Create(ctx, c); err != nil {
			log.Info("course may exist", "title", sc.title, "error", err)
			continue
		}
		createdCourses = append(createdCourses, c)
		log.Info("course created", "title", c.Title, "id", c.ID)
	}

	if len(createdCourses) == 0 {
		log.Info("no new courses created, seed may already be applied")
		fmt.Println("\n✓ Seed already applied. Use these credentials to log in:")
		printCredentials(org.Slug)
		return
	}

	// ── Assign teacher to published courses ────────────────────────────────────
	for _, course := range createdCourses {
		if course.Status != entities.StatusPublished {
			continue
		}
		ct := &entities.CourseTeacher{
			ID:         uuid.New(),
			CourseID:   course.ID,
			TeacherID:  teacher.ID,
			OrgID:      org.ID,
			AssignedAt: now,
		}
		if err := courseTeacherRepo.Add(ctx, ct); err != nil {
			log.Info("course teacher may exist", "course", course.Title)
		} else {
			log.Info("teacher assigned to course", "course", course.Title)
		}
	}

	// ── Modules & Lessons (for the first two courses) ─────────────────────────
	type lessonDef struct {
		title      string
		lessonType entities.LessonType
		content    string
		videoURL   string
	}
	type moduleDef struct {
		title   string
		lessons []lessonDef
	}

	courseModules := [][]moduleDef{
		// Course 0: Go тіліне кіріспе
		{
			{
				"Бастау",
				[]lessonDef{
					{"Go тілі дегеніміз не?", entities.LessonText,
						"Go (немесе Golang) — Google әзірлеген ашық бастапқы код бағдарламалау тілі. Ол статикалық типтелген, компиляцияланатын және қарапайымдылық пен тиімділікке арналған. Негізгі мүмкіндіктері: қоқыс жинау, кірістірілген параллельдік примитивтер (горутиндер мен каналдар) және бай стандартты кітапхана.",
						""},
					{"Go орнату және ортаны баптау", entities.LessonVideo,
						"Бұл сабақта Go-ны компьютеріңізге орнатып, редакторды (Go кеңейтімі бар VS Code ұсынылады) баптайсыз.",
						"https://www.youtube.com/watch?v=example1"},
					{"Сәлем, Әлем!", entities.LessonText,
						"package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Сәлем, Әлем!\")\n}\n\nЕр Go бағдарламасы пакет декларациясынан басталады. main пакеті ерекше — ол орындалатын файлды анықтайды.",
						""},
				},
			},
			{
				"Негізгі тұжырымдамалар",
				[]lessonDef{
					{"Айнымалылар және типтер", entities.LessonText,
						"Go статикалық типтелген. Айнымалылар var немесе := қысқа синтаксисімен жариялануы мүмкін. Негізгі типтер: int, float64, string, bool. Go сонымен қатар массивтерді, тілімдерді, карталарды және құрылымдарды қолдайды.",
						""},
					{"Функциялар және қате өңдеу", entities.LessonText,
						"Go-дағы функциялар бірнеше мән қайтара алады. Қателерді өңдеудің идиоматикалық тәсілі — қатені соңғы қайтарылатын мән ретінде қайтару және оны нақты тексеру.",
						""},
					{"Горутиндер және каналдар", entities.LessonVideo,
						"Горутиндер — Go жұмыс уақытымен басқарылатын жеңіл ағындар. Каналдар — горутиндердің байланысатын типтелген өткізгіштер.",
						"https://www.youtube.com/watch?v=example2"},
				},
			},
			{
				"Стандартты кітапхананы терең зерттеу",
				[]lessonDef{
					{"net/http-пен жұмыс", entities.LessonText,
						"net/http пакеті HTTP клиент пен сервер іске асырымдарын ұсынады. Базалық серверді құру тек бірнеше жол кодты қажет етеді.",
						""},
					{"Go-да тестілеу", entities.LessonText,
						"Go-да кірістірілген тестілеу пакеті бар. Тест файлдары _test.go-мен аяқталады. Test деп басталатын функцияларды go test іске қосады.",
						""},
				},
			},
		},
		// Course 1: Gin арқылы веб-әзірлеу
		{
			{
				"Gin негіздері",
				[]lessonDef{
					{"Неліктен Gin?", entities.LessonText,
						"Gin — Go үшін жоғары өнімді HTTP фреймворк. Ол маршруттауға радикс ағашын пайдаланады, шағын жады ізімен ерекшеленеді және JSON байластыру, тексеру мен middleware тізбектеу үшін ыңғайлы көмекшілер ұсынады.",
						""},
					{"Маршруттау және жол параметрлері", entities.LessonText,
						"Gin статикалық маршруттарды, атаулы параметрлерді (:id) және қойылмалы таңба параметрлерін (*path) қолдайды.",
						""},
					{"Middleware тізбегі", entities.LessonVideo,
						"Middleware функциялары өңдеуші тізбектерін орайды. Олар сұраныс контекстін өзгерте алады, тізбекті қысқартады (c.Abort) немесе жауап тақырыптарын қоса алады.",
						"https://www.youtube.com/watch?v=example3"},
				},
			},
			{
				"REST API жасау",
				[]lessonDef{
					{"Сұранысты байластыру және тексеру", entities.LessonText,
						"c.ShouldBindJSON пайдаланып сұраныс денелерін талдаңыз және тексеріңіз. binding:\"required,email\" сияқты тег атрибуттары ережелерді декларативті түрде орындайды.",
						""},
					{"Қате өңдеу үлгілері", entities.LessonText,
						"Қалпына келтіру middleware арқылы орталықтандырылған қате өңдеу өңдеушілерді таза сақтайды.",
						""},
					{"JWT аутентификациясы", entities.LessonVideo,
						"JSON веб-токендері құпия кілтпен қол қойылған талаптарды тасымалдайды. Middleware-де токенді тексеріп, талаптарды шығарып алыңыз.",
						"https://www.youtube.com/watch?v=example4"},
				},
			},
		},
	}

	for ci, course := range createdCourses {
		if ci >= len(courseModules) {
			break
		}
		for mi, md := range courseModules[ci] {
			module := &entities.Module{
				ID:        uuid.New(),
				CourseID:  course.ID,
				OrgID:     org.ID,
				Title:     md.title,
				Position:  mi + 1,
				CreatedAt: now,
				UpdatedAt: now,
			}
			if err := moduleRepo.Create(ctx, module); err != nil {
				log.Error("failed to create module", "error", err)
				continue
			}
			log.Info("module created", "title", module.Title)

			for li, ld := range md.lessons {
				lesson := &entities.Lesson{
					ID:        uuid.New(),
					ModuleID:  module.ID,
					OrgID:     org.ID,
					Title:     ld.title,
					Content:   ld.content,
					Type:      ld.lessonType,
					VideoURL:  ld.videoURL,
					Position:  li + 1,
					CreatedAt: now,
					UpdatedAt: now,
				}
				if err := lessonRepo.Create(ctx, lesson); err != nil {
					log.Error("failed to create lesson", "error", err)
					continue
				}
				log.Info("  lesson created", "title", lesson.Title)

				// Add a quiz to text lessons in the first module of each course
				if mi == 0 && li == 0 && ld.lessonType == entities.LessonText {
					seedQuiz(ctx, quizRepo, lesson, org.ID, now, log)
				}
			}
		}
	}

	// ── Progress records for Sanzhar ─────────────────────────────────────────
	sanzhar := createdUsers["sanzhar@nu.edu.kz"]
	if len(createdCourses) > 0 {
		modules, _ := moduleRepo.FindByCourse(ctx, createdCourses[0].ID, org.ID)
		for _, mod := range modules {
			lessons, _ := lessonRepo.FindByModule(ctx, mod.ID, org.ID)
			for i, lesson := range lessons {
				if i >= 2 {
					break // only mark first 2 lessons per module as complete
				}
				completedAt := now.Add(-time.Duration(i+1) * 24 * time.Hour)
				score := 85.0 + float64(i)*5
				p := &entities.LessonProgress{
					ID:          uuid.New(),
					UserID:      sanzhar.ID,
					LessonID:    lesson.ID,
					OrgID:       org.ID,
					CompletedAt: &completedAt,
					Score:       &score,
					CreatedAt:   completedAt,
					UpdatedAt:   completedAt,
				}
				if err := progressRepo.Create(ctx, p); err != nil {
					log.Info("progress may exist", "lesson", lesson.Title)
				}
			}
		}
		log.Info("progress seeded for Sanzhar")
	}

	fmt.Println()
	fmt.Println("✓ Seed complete!")
	fmt.Println()
	printCredentials(org.Slug)
}

func seedQuiz(ctx context.Context, repo *infraRepos.GORMQuizRepository, lesson *entities.Lesson, orgID uuid.UUID, now time.Time, log *logger.Logger) {
	qID1, qID2 := uuid.New(), uuid.New()
	quiz := &entities.Quiz{
		ID:       uuid.New(),
		LessonID: lesson.ID,
		OrgID:    orgID,
		Title:    lesson.Title + " – Жылдам тексеру",
		Questions: []entities.QuizQuestion{
			{
				ID:       qID1,
				Question: "Go бағдарламалау тілін кім жасады?",
				Position: 1,
				Answers: []entities.QuizAnswer{
					{ID: uuid.New(), QuestionID: qID1, Answer: "Google", IsCorrect: true, CreatedAt: now, UpdatedAt: now},
					{ID: uuid.New(), QuestionID: qID1, Answer: "Microsoft", IsCorrect: false, CreatedAt: now, UpdatedAt: now},
					{ID: uuid.New(), QuestionID: qID1, Answer: "Meta", IsCorrect: false, CreatedAt: now, UpdatedAt: now},
					{ID: uuid.New(), QuestionID: qID1, Answer: "Apple", IsCorrect: false, CreatedAt: now, UpdatedAt: now},
				},
				CreatedAt: now,
				UpdatedAt: now,
			},
			{
				ID:       qID2,
				Question: "Go-да айнымалыны қысқа синтаксиспен жариялауға қандай кілт сөз қолданылады?",
				Position: 2,
				Answers: []entities.QuizAnswer{
					{ID: uuid.New(), QuestionID: qID2, Answer: ":=", IsCorrect: true, CreatedAt: now, UpdatedAt: now},
					{ID: uuid.New(), QuestionID: qID2, Answer: "var", IsCorrect: false, CreatedAt: now, UpdatedAt: now},
					{ID: uuid.New(), QuestionID: qID2, Answer: "let", IsCorrect: false, CreatedAt: now, UpdatedAt: now},
					{ID: uuid.New(), QuestionID: qID2, Answer: "def", IsCorrect: false, CreatedAt: now, UpdatedAt: now},
				},
				CreatedAt: now,
				UpdatedAt: now,
			},
		},
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := repo.Create(ctx, quiz); err != nil {
		log.Error("failed to create quiz", "error", err)
		return
	}
	log.Info("  quiz created", "title", quiz.Title)
}

func printCredentials(orgSlug string) {
	fmt.Printf("  Ұйым (org slug) : %s\n\n", orgSlug)
	fmt.Println("  Рөл       Email                      Құпиясөз")
	fmt.Println("  ────────────────────────────────────────────────────")
	fmt.Println("  admin     aiguerim@nu.edu.kz         password123")
	fmt.Println("  teacher   baurzhan@nu.edu.kz         password123")
	fmt.Println("  student   sanzhar@nu.edu.kz          password123")
	fmt.Println("  student   zhanar@nu.edu.kz           password123")
	fmt.Println()
	fmt.Printf("  Кіру мысалы:\n")
	fmt.Printf("  curl -X POST http://localhost:8080/api/v1/auth/login \\\n")
	fmt.Printf("    -H 'Content-Type: application/json' \\\n")
	fmt.Printf("    -H 'X-Org-Slug: %s' \\\n", orgSlug)
	fmt.Printf("    -d '{\"email\":\"aiguerim@nu.edu.kz\",\"password\":\"password123\"}'\n")
}
