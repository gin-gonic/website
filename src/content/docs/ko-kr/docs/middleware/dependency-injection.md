---
title: "의존성 주입 패턴"
sidebar:
  order: 10
---

Gin 애플리케이션이 커지면 데이터베이스 연결, 설정, 서비스 등의 의존성을 핸들러 간에 공유하는 깔끔한 방법이 필요합니다. Go의 단순함은 무거운 DI 프레임워크보다 직관적인 패턴을 권장합니다.

## 클로저 패턴

가장 관용적인 Go 접근 방식: 클로저를 통해 의존성을 전달합니다.

```go
package main

import (
  "database/sql"
  "net/http"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

func PingHandler(db *sql.DB) gin.HandlerFunc {
  return func(c *gin.Context) {
    if err := db.Ping(); err != nil {
      c.JSON(http.StatusServiceUnavailable, gin.H{"error": "database unreachable"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "ok"})
  }
}

func GetUserHandler(db *sql.DB) gin.HandlerFunc {
  return func(c *gin.Context) {
    id := c.Param("id")
    var name string
    err := db.QueryRowContext(c.Request.Context(), "SELECT name FROM users WHERE id = $1", id).Scan(&name)
    if err != nil {
      c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"name": name})
  }
}

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname?sslmode=disable")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  r := gin.Default()
  r.GET("/ping", PingHandler(db))
  r.GET("/users/:id", GetUserHandler(db))
  r.Run(":8080")
}
```

이 패턴은 소규모에서 중규모 애플리케이션에 적합합니다. 각 핸들러가 의존성을 명시적으로 선언합니다.

## 구조체 기반 핸들러

공유 의존성이 많은 애플리케이션의 경우, 핸들러를 구조체에 그룹화합니다:

```go
package main

import (
  "database/sql"
  "log/slog"
  "net/http"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

type App struct {
  DB     *sql.DB
  Logger *slog.Logger
}

func (a *App) GetUser(c *gin.Context) {
  id := c.Param("id")
  var name string
  err := a.DB.QueryRowContext(c.Request.Context(), "SELECT name FROM users WHERE id = $1", id).Scan(&name)
  if err != nil {
    a.Logger.Error("user not found", slog.String("id", id), slog.String("error", err.Error()))
    c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
    return
  }
  c.JSON(http.StatusOK, gin.H{"id": id, "name": name})
}

func (a *App) CreateUser(c *gin.Context) {
  var input struct {
    Name string `json:"name" binding:"required"`
  }
  if err := c.ShouldBindJSON(&input); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  _, err := a.DB.ExecContext(c.Request.Context(), "INSERT INTO users (name) VALUES ($1)", input.Name)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
    return
  }
  c.JSON(http.StatusCreated, gin.H{"name": input.Name})
}

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname?sslmode=disable")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  app := &App{
    DB:     db,
    Logger: slog.Default(),
  }

  r := gin.Default()
  r.GET("/users/:id", app.GetUser)
  r.POST("/users", app.CreateUser)
  r.Run(":8080")
}
```

## 미들웨어 주입

미들웨어를 사용하여 요청 컨텍스트에 의존성을 주입합니다. 많은 핸들러가 동일한 의존성을 필요로 할 때 유용합니다:

```go
func DatabaseMiddleware(db *sql.DB) gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  }
}

func GetUser(c *gin.Context) {
  db := c.MustGet("db").(*sql.DB)
  // db 사용...
}

func main() {
  db, _ := sql.Open("postgres", "postgres://user:pass@localhost/dbname?sslmode=disable")

  r := gin.Default()
  r.Use(DatabaseMiddleware(db))
  r.GET("/users/:id", GetUser)
  r.Run(":8080")
}
```

:::note
미들웨어 패턴은 `interface{}`와 타입 어설션을 사용하므로 컴파일 타임 타입 안전성이 상실됩니다. 가능하면 클로저 또는 구조체 패턴을 선호하세요.
:::

## 패턴 비교

| 패턴 | 타입 안전성 | 테스트 용이성 | 적합한 경우 |
|---------|-------------|-------------|----------|
| 클로저 | 컴파일 타임 | 모킹 용이 | 소규모 앱, 적은 의존성 |
| 구조체 | 컴파일 타임 | 모킹 용이 | 중대규모 앱 |
| 미들웨어 | 런타임 | 보통 | 횡단 관심사, 공유 상태 |

## 의존성 주입을 활용한 테스트

모든 패턴은 테스트를 간편하게 만듭니다 -- 테스트 대역을 주입합니다:

```go
func TestGetUser(t *testing.T) {
  // 테스트 데이터베이스 또는 모의 설정
  db := setupTestDB(t)

  router := gin.New()
  router.GET("/users/:id", GetUserHandler(db)) // 클로저 패턴

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/users/1", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
}
```

## 참고

- [데이터베이스 통합](/ko-kr/docs/server-config/database/)
- [테스트](/ko-kr/docs/testing/)
- [미들웨어 사용하기](/ko-kr/docs/middleware/using-middleware/)
