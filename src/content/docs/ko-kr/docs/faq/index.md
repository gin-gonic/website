---
title: "FAQ"
sidebar:
  order: 15
---

## 일반 질문

### 개발 중 실시간 리로드를 어떻게 활성화하나요?

개발 중 자동 실시간 리로드를 위해 [Air](https://github.com/air-verse/air)를 사용하세요. Air는 파일을 감시하고 변경이 감지되면 애플리케이션을 자동으로 재빌드/재시작합니다.

**설치:**

```sh
go install github.com/air-verse/air@latest
```

**설정:**

프로젝트 루트에 `.air.toml` 설정 파일을 생성합니다:

```sh
air init
```

그런 다음 프로젝트 디렉토리에서 `go run` 대신 `air`를 실행합니다:

```sh
air
```

Air는 `.go` 파일을 감시하고 변경 시 Gin 애플리케이션을 자동으로 재빌드/재시작합니다. 설정 옵션은 [Air 문서](https://github.com/air-verse/air)를 참조하세요.

### Gin에서 CORS를 어떻게 처리하나요?

공식 [gin-contrib/cors](https://github.com/gin-contrib/cors) 미들웨어를 사용하세요:

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

전체 보안 개요는 [보안 모범 사례](/ko-kr/docs/middleware/security-guide/)를 참조하세요.

### 정적 파일은 어떻게 서빙하나요?

`Static()` 또는 `StaticFS()`를 사용하여 정적 파일을 서빙합니다:

```go
func main() {
  r := gin.Default()

  // ./assets 디렉토리의 파일을 /assets/*로 서빙
  r.Static("/assets", "./assets")

  // 단일 파일 서빙
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // 임베디드 파일시스템에서 서빙 (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

자세한 내용은 [파일에서 데이터 서빙](/ko-kr/docs/rendering/serving-data-from-file/)을 참조하세요.

### 파일 업로드는 어떻게 처리하나요?

단일 파일에는 `FormFile()`을, 다중 파일에는 `MultipartForm()`을 사용합니다:

```go
// 단일 파일 업로드
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  c.String(200, "File %s uploaded successfully", file.Filename)
})

// 다중 파일 업로드
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }
  c.String(200, "%d files uploaded", len(files))
})
```

자세한 내용은 [파일 업로드](/ko-kr/docs/routing/upload-file/) 문서를 참조하세요.

### JWT로 인증을 어떻게 구현하나요?

[gin-contrib/jwt](https://github.com/gin-contrib/jwt)를 사용하거나 커스텀 미들웨어를 구현하세요. 다음은 최소한의 예제입니다:

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

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization token"})
      c.Abort()
      return
    }

    // "Bearer " 접두사 제거
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    }
  }
}
```

세션 기반 인증에 대해서는 [세션 관리](/ko-kr/docs/middleware/session-management/)를 참조하세요.

### 요청 로깅은 어떻게 설정하나요?

Gin은 `gin.Default()`를 통해 기본 로거 미들웨어를 포함합니다. 프로덕션에서 구조화된 JSON 로깅을 사용하려면 [구조화된 로깅](/ko-kr/docs/logging/structured-logging/)을 참조하세요.

기본 로그 커스터마이즈:

```go
r := gin.New()
r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
  SkipPaths: []string{"/healthz"},
}))
r.Use(gin.Recovery())
```

커스텀 형식, 파일 출력, 쿼리 문자열 건너뛰기를 포함한 모든 옵션은 [로깅](/ko-kr/docs/logging/) 섹션을 참조하세요.

### 우아한 종료는 어떻게 처리하나요?

코드 예제를 포함한 완전한 가이드는 [우아한 재시작 또는 중지](/ko-kr/docs/server-config/graceful-restart-or-stop/)를 참조하세요.

### "405 Method Not Allowed" 대신 "404 Not Found"가 반환되는 이유는 무엇인가요?

기본적으로 Gin은 요청된 HTTP 메서드를 지원하지 않는 라우트에 대해 404를 반환합니다. 대신 405를 반환하려면 `HandleMethodNotAllowed = true`를 설정하세요:

```go
r := gin.Default()
r.HandleMethodNotAllowed = true

r.GET("/ping", func(c *gin.Context) {
  c.JSON(200, gin.H{"message": "pong"})
})

r.Run()
```

```sh
$ curl -X POST localhost:8080/ping

HTTP/1.1 405 Method Not Allowed
Allow: GET
```

### 쿼리 매개변수와 POST 데이터를 함께 바인딩하려면 어떻게 하나요?

Content type에 따라 자동으로 바인딩을 선택하는 `ShouldBind()`를 사용하세요:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

모든 바인딩 옵션은 [바인딩](/ko-kr/docs/binding/) 섹션을 참조하세요.

### 요청 데이터는 어떻게 유효성 검사하나요?

Gin은 유효성 검사를 위해 [go-playground/validator](https://github.com/go-playground/validator)를 사용합니다. 구조체에 유효성 검사 태그를 추가하세요:

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
  c.JSON(200, gin.H{"message": "User is valid"})
})
```

커스텀 유효성 검사기 및 고급 사용법은 [바인딩 및 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)를 참조하세요.

### 프로덕션 모드에서 Gin을 어떻게 실행하나요?

`GIN_MODE` 환경 변수를 `release`로 설정하세요:

```sh
export GIN_MODE=release
# 또는
GIN_MODE=release ./your-app
```

또는 프로그래밍 방식으로 설정합니다:

```go
gin.SetMode(gin.ReleaseMode)
```

릴리스 모드는 디버그 로깅을 비활성화하고 성능을 향상시킵니다.

### Gin에서 데이터베이스 연결은 어떻게 처리하나요?

`database/sql`, GORM, 커넥션 풀링, 의존성 주입 패턴을 다루는 완전한 가이드는 [데이터베이스 통합](/ko-kr/docs/server-config/database/)을 참조하세요.

### Gin 핸들러를 어떻게 테스트하나요?

`net/http/httptest`를 사용하여 라우트를 테스트합니다:

```go
func TestPingRoute(t *testing.T) {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

더 많은 예제는 [테스트](/ko-kr/docs/testing/) 문서를 참조하세요.

## 성능 관련 질문

### 높은 트래픽에 대해 Gin을 어떻게 최적화하나요?

1. **릴리스 모드 사용**: `GIN_MODE=release` 설정
2. **불필요한 미들웨어 비활성화**: 필요한 것만 사용
3. **수동 미들웨어 제어를 위해 `gin.Default()` 대신 `gin.New()` 사용**
4. **커넥션 풀링**: 데이터베이스 커넥션 풀 설정 ([데이터베이스 통합](/ko-kr/docs/server-config/database/) 참조)
5. **캐싱**: 자주 접근하는 데이터에 대한 캐싱 구현
6. **로드 밸런싱**: 리버스 프록시 사용 (nginx, HAProxy)
7. **프로파일링**: Go의 pprof를 사용하여 병목 지점 식별
8. **모니터링**: 성능 추적을 위한 [메트릭 및 모니터링](/ko-kr/docs/server-config/metrics/) 설정

### Gin은 프로덕션에서 사용할 준비가 되었나요?

예. Gin은 많은 기업에서 프로덕션에 사용되고 있으며 대규모로 실전 검증되었습니다. 프로덕션에서 Gin을 사용하는 프로젝트 예시는 [사용자](/ko-kr/docs/users/)를 참조하세요.

## 문제 해결

### 라우트 매개변수가 작동하지 않는 이유는 무엇인가요?

라우트 매개변수가 `:` 구문을 사용하고 올바르게 추출되는지 확인하세요:

```go
// 올바름
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// 아님: /user/{id} 또는 /user/<id>
```

자세한 내용은 [경로 매개변수](/ko-kr/docs/routing/param-in-path/)를 참조하세요.

### 미들웨어가 실행되지 않는 이유는 무엇인가요?

미들웨어는 라우트 또는 라우트 그룹보다 먼저 등록해야 합니다:

```go
// 올바른 순서
r := gin.New()
r.Use(MyMiddleware()) // 먼저 미들웨어 등록
r.GET("/ping", handler) // 그 다음 라우트

// 라우트 그룹의 경우
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // 이 그룹을 위한 미들웨어
{
  auth.GET("/dashboard", handler)
}
```

자세한 내용은 [미들웨어 사용하기](/ko-kr/docs/middleware/using-middleware/)를 참조하세요.

### 요청 바인딩이 실패하는 이유는 무엇인가요?

일반적인 원인:

1. **바인딩 태그 누락**: `json:"field"` 또는 `form:"field"` 태그 추가
2. **Content-Type 불일치**: 클라이언트가 올바른 Content-Type 헤더를 보내는지 확인
3. **유효성 검사 오류**: 유효성 검사 태그와 요구 사항 확인
4. **내보내지 않은 필드**: 내보낸(대문자) 구조체 필드만 바인딩됨

```go
type User struct {
  Name  string `json:"name" binding:"required"` // 올바름
  Email string `json:"email"`                    // 올바름
  age   int    `json:"age"`                      // 바인딩되지 않음 (내보내지 않음)
}
```

자세한 내용은 [바인딩 및 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)를 참조하세요.
