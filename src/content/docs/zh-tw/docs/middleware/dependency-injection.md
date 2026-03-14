---
title: "依賴注入模式"
sidebar:
  order: 10
---

隨著 Gin 應用程式的成長，你需要一種乾淨的方式在處理函式之間共享依賴項，如資料庫連線、配置和服務。Go 的簡潔性鼓勵使用直接的模式，而非沉重的 DI 框架。

## 閉包模式

最符合 Go 慣例的方式：透過閉包傳遞依賴項。

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

此模式適用於中小型應用程式。每個處理函式明確宣告其依賴項。

## 結構體處理函式

對於有許多共用依賴項的應用程式，將處理函式分組在結構體中：

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

## 中介軟體注入

使用中介軟體將依賴項注入到請求上下文中。當許多處理函式需要相同的依賴項時很有用：

```go
func DatabaseMiddleware(db *sql.DB) gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  }
}

func GetUser(c *gin.Context) {
  db := c.MustGet("db").(*sql.DB)
  // Use db...
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
中介軟體模式使用 `interface{}` 和類型斷言，會失去編譯期型別安全性。盡可能優先使用閉包或結構體模式。
:::

## 模式比較

| 模式 | 型別安全性 | 可測試性 | 適用於 |
|---------|-------------|-------------|----------|
| 閉包 | 編譯期 | 容易模擬 | 小型應用、少量依賴項 |
| 結構體 | 編譯期 | 容易模擬 | 中大型應用 |
| 中介軟體 | 執行期 | 中等 | 橫切關注點、共享狀態 |

## 使用依賴注入進行測試

所有模式都讓測試變得簡單——注入測試替身即可：

```go
func TestGetUser(t *testing.T) {
  // Set up test database or mock
  db := setupTestDB(t)

  router := gin.New()
  router.GET("/users/:id", GetUserHandler(db)) // closure pattern

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/users/1", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
}
```

## 另請參閱

- [資料庫整合](/zh-tw/docs/server-config/database/)
- [測試](/zh-tw/docs/testing/)
- [使用中介軟體](/zh-tw/docs/middleware/using-middleware/)
