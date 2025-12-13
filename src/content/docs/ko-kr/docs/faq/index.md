---
title: "FAQ"
sidebar:
  order: 9
---

## 일반 질문

### 개발 중 라이브 리로드를 활성화하려면 어떻게 하나요?

[Air](https://github.com/cosmtrek/air)를 사용하여 개발 중 자동 라이브 리로드를 구현합니다. Air는 파일을 감시하고 변경이 감지되면 애플리케이션을 자동으로 재빌드/재시작합니다.

**설치:**

```sh
# Air 전역 설치
go install github.com/cosmtrek/air@latest
```

**설정:**

프로젝트 루트에 `.air.toml` 설정 파일을 생성합니다:

```sh
air init
```

기본 설정이 생성됩니다. Gin 프로젝트에 맞게 커스터마이즈할 수 있습니다:

```toml
# .air.toml
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  args_bin = []
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ."
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor", "testdata"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  include_file = []
  kill_delay = "0s"
  log = "build-errors.log"
  poll = false
  poll_interval = 0
  rerun = false
  rerun_delay = 500
  send_interrupt = false
  stop_on_error = false

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  main_only = false
  time = false

[misc]
  clean_on_exit = false

[screen]
  clear_on_rebuild = false
  keep_scroll = true
```

**사용법:**

프로젝트 디렉토리에서 `go run` 대신 `air`를 실행합니다:

```sh
air
```

Air가 `.go` 파일을 감시하고 변경 시 Gin 애플리케이션을 자동으로 재빌드/재시작합니다.

### Gin에서 CORS를 처리하려면 어떻게 하나요?

공식 [gin-contrib/cors](https://github.com/gin-contrib/cors) 미들웨어를 사용합니다:

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // 기본 CORS 설정
  r.Use(cors.Default())

  // 또는 CORS 설정 커스터마이즈
  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

### 정적 파일을 제공하려면 어떻게 하나요?

`Static()` 또는 `StaticFS()`를 사용하여 정적 파일을 제공합니다:

```go
func main() {
  r := gin.Default()

  // /assets/* 경로에서 ./assets 디렉토리의 파일 제공
  r.Static("/assets", "./assets")

  // 단일 파일 제공
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // 임베디드 파일 시스템에서 제공 (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

자세한 내용은 [정적 파일 제공 예제](../examples/serving-static-files/)를 참조하세요.

### 파일 업로드를 처리하려면 어떻게 하나요?

단일 파일에는 `FormFile()`을, 다중 파일에는 `MultipartForm()`을 사용합니다:

```go
// 단일 파일 업로드
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")

  // 파일 저장
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)

  c.String(200, "파일 %s 업로드 성공", file.Filename)
})

// 다중 파일 업로드
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }

  c.String(200, "%d개 파일 업로드됨", len(files))
})
```

자세한 내용은 [파일 업로드 예제](../examples/upload-file/)를 참조하세요.

### JWT로 인증을 구현하려면 어떻게 하나요?

[gin-contrib/jwt](https://github.com/gin-contrib/jwt)를 사용하거나 커스텀 미들웨어를 구현합니다:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key")

type Claims struct {
  Username string `json:"username"`
  jwt.RegisteredClaims
}

func GenerateToken(username string) (string, error) {
  claims := Claims{
    Username: username,
    RegisteredClaims: jwt.RegisteredClaims{
      ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
      IssuedAt:  jwt.NewNumericDate(time.Now()),
    },
  }

  token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
  return token.SignedString(jwtSecret)
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "인증 토큰이 없습니다"})
      c.Abort()
      return
    }

    // "Bearer " 접두사 제거 (있는 경우)
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "유효하지 않은 토큰"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "유효하지 않은 토큰 클레임"})
      c.Abort()
    }
  }
}

func main() {
  r := gin.Default()

  r.POST("/login", func(c *gin.Context) {
    var credentials struct {
      Username string `json:"username"`
      Password string `json:"password"`
    }

    if err := c.BindJSON(&credentials); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    // 자격 증명 검증 (자체 로직 구현)
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "유효하지 않은 자격 증명"})
    }
  })

  // 보호된 라우트
  authorized := r.Group("/")
  authorized.Use(AuthMiddleware())
  {
    authorized.GET("/profile", func(c *gin.Context) {
      username := c.MustGet("username").(string)
      c.JSON(http.StatusOK, gin.H{"username": username})
    })
  }

  r.Run()
}
```

### 요청 로깅을 설정하려면 어떻게 하나요?

Gin에는 기본 로거 미들웨어가 포함되어 있습니다. 커스터마이즈하거나 구조화된 로깅을 사용합니다:

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

// 커스텀 로거 미들웨어
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()
    path := c.Request.URL.Path

    c.Next()

    latency := time.Since(start)
    statusCode := c.Writer.Status()
    clientIP := c.ClientIP()
    method := c.Request.Method

    log.Printf("[GIN] %s | %3d | %13v | %15s | %-7s %s",
      time.Now().Format("2006/01/02 - 15:04:05"),
      statusCode,
      latency,
      clientIP,
      method,
      path,
    )
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

더 고급 로깅은 [커스텀 로그 형식 예제](../examples/custom-log-format/)를 참조하세요.

### 그레이스풀 셧다운을 처리하려면 어떻게 하나요?

연결을 제대로 닫기 위해 그레이스풀 셧다운을 구현합니다:

```go
package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "환영합니다!")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }

  // 고루틴에서 서버 실행
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("리슨: %s\n", err)
    }
  }()

  // 서버를 그레이스풀하게 종료하기 위한 인터럽트 시그널 대기
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("서버 종료 중...")

  // 미완료 요청에 5초의 유예 시간 부여
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("서버 강제 종료:", err)
  }

  log.Println("서버 종료됨")
}
```

자세한 내용은 [그레이스풀 리스타트 또는 중지 예제](../examples/graceful-restart-or-stop/)를 참조하세요.

### 왜 "405 Method Not Allowed" 대신 "404 Not Found"가 반환되나요?

기본적으로 Gin은 요청된 HTTP 메서드를 지원하지 않는 라우트에 대해 404를 반환합니다. 405 Method Not Allowed를 반환하려면 `HandleMethodNotAllowed` 옵션을 활성화하세요.

자세한 내용은 [Method Not Allowed FAQ](./method-not-allowed/)를 참조하세요.

### 쿼리 파라미터와 POST 데이터를 동시에 바인딩하려면 어떻게 하나요?

`ShouldBind()`를 사용합니다. 콘텐츠 타입에 따라 자동으로 바인딩을 선택합니다:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // 쿼리 파라미터와 요청 바디 (JSON/폼) 바인딩
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

더 세밀한 제어는 [쿼리 또는 POST 바인드 예제](../examples/bind-query-or-post/)를 참조하세요.

### 요청 데이터를 검증하려면 어떻게 하나요?

Gin은 검증에 [go-playground/validator](https://github.com/go-playground/validator)를 사용합니다. 구조체에 검증 태그를 추가합니다:

```go
type User struct {
  Name  string `json:"name" binding:"required,min=3,max=50"`
  Email string `json:"email" binding:"required,email"`
  Age   int    `json:"age" binding:"gte=0,lte=130"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBindJSON(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, gin.H{"message": "사용자가 유효합니다"})
})
```

커스텀 검증기는 [커스텀 검증기 예제](../examples/custom-validators/)를 참조하세요.

### 프로덕션 모드에서 Gin을 실행하려면 어떻게 하나요?

`GIN_MODE` 환경 변수를 `release`로 설정합니다:

```sh
export GIN_MODE=release
# 또는
GIN_MODE=release ./your-app
```

또는 프로그래밍 방식으로 설정합니다:

```go
gin.SetMode(gin.ReleaseMode)
```

릴리즈 모드:

- 디버그 로깅 비활성화
- 성능 향상
- 바이너리 크기 약간 감소

### Gin에서 데이터베이스 연결을 처리하려면 어떻게 하나요?

의존성 주입 또는 컨텍스트를 사용하여 데이터베이스 연결을 공유합니다:

```go
package main

import (
  "database/sql"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  r := gin.Default()

  // 방법 1: db를 핸들러에 전달
  r.GET("/users", func(c *gin.Context) {
    var users []string
    rows, _ := db.Query("SELECT name FROM users")
    defer rows.Close()

    for rows.Next() {
      var name string
      rows.Scan(&name)
      users = append(users, name)
    }

    c.JSON(200, users)
  })

  // 방법 2: 미들웨어를 사용하여 db 주입
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })

  r.Run()
}
```

ORM은 Gin과 [GORM](https://gorm.io/) 함께 사용을 고려하세요.

### Gin 핸들러를 테스트하려면 어떻게 하나요?

`net/http/httptest`를 사용하여 라우트를 테스트합니다:

```go
package main

import (
  "net/http"
  "net/http/httptest"
  "testing"

  "github.com/gin-gonic/gin"
  "github.com/stretchr/testify/assert"
)

func SetupRouter() *gin.Engine {
  r := gin.Default()
  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })
  return r
}

func TestPingRoute(t *testing.T) {
  router := SetupRouter()

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

더 많은 예제는 [테스트 문서](../testing/)를 참조하세요.

## 성능 질문

### 높은 트래픽을 위해 Gin을 최적화하려면 어떻게 하나요?

1. **릴리즈 모드 사용**: `GIN_MODE=release` 설정
2. **불필요한 미들웨어 비활성화**: 필요한 것만 사용
3. **미들웨어를 수동으로 제어하려면 `gin.Default()` 대신 `gin.New()` 사용**
4. **연결 풀링**: 데이터베이스 연결 풀을 적절히 구성
5. **캐싱**: 자주 접근하는 데이터에 캐싱 구현
6. **로드 밸런싱**: 리버스 프록시 (nginx, HAProxy) 사용
7. **프로파일링**: Go의 pprof를 사용하여 병목 현상 식별

```go
r := gin.New()
r.Use(gin.Recovery()) // recovery 미들웨어만 사용

// 연결 풀 제한 설정
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### Gin은 프로덕션에서 사용할 수 있나요?

네! Gin은 많은 회사에서 프로덕션 환경에서 사용되며 대규모로 실전 테스트되었습니다. 가장 인기 있는 Go 웹 프레임워크 중 하나이며 다음과 같은 특징이 있습니다:

- 활발한 유지보수 및 커뮤니티
- 광범위한 미들웨어 에코시스템
- 우수한 성능 벤치마크
- 강력한 하위 호환성

## 문제 해결

### 라우트 파라미터가 작동하지 않는 이유는 무엇인가요?

라우트 파라미터가 `:` 구문을 사용하고 올바르게 추출되는지 확인합니다:

```go
// 올바름
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "사용자 ID: %s", id)
})

// 잘못됨: /user/{id} 또는 /user/<id>
```

### 미들웨어가 실행되지 않는 이유는 무엇인가요?

미들웨어는 라우트 또는 라우트 그룹 전에 등록해야 합니다:

```go
// 올바른 순서
r := gin.New()
r.Use(MyMiddleware()) // 먼저 미들웨어 등록
r.GET("/ping", handler) // 그 다음 라우트

// 라우트 그룹의 경우
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // 이 그룹의 미들웨어
{
  auth.GET("/dashboard", handler)
}
```

### 요청 바인딩이 실패하는 이유는 무엇인가요?

일반적인 이유:

1. **바인딩 태그 누락**: `json:"field"` 또는 `form:"field"` 태그 추가
2. **Content-Type 불일치**: 클라이언트가 올바른 Content-Type 헤더를 보내는지 확인
3. **검증 오류**: 검증 태그와 요구 사항 확인
4. **내보내지지 않은 필드**: 내보낸 (대문자로 시작하는) 구조체 필드만 바인딩됨

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ 올바름
  Email string `json:"email"`                    // ✓ 올바름
  age   int    `json:"age"`                      // ✗ 바인딩되지 않음 (내보내지지 않음)
}
```
