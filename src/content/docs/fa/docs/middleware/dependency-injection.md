---
title: "الگوهای تزریق وابستگی"
sidebar:
  order: 10
---

با رشد برنامه Gin شما، نیاز به روشی تمیز برای اشتراک وابستگی‌ها مانند اتصالات پایگاه داده، پیکربندی و سرویس‌ها در بین handlerها دارید. سادگی Go الگوهای ساده را به جای فریم‌ورک‌های سنگین DI تشویق می‌کند.

## الگوی closure

اصطلاحی‌ترین رویکرد Go: ارسال وابستگی‌ها از طریق closureها.

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

این الگو برای برنامه‌های کوچک تا متوسط به خوبی کار می‌کند. هر handler وابستگی‌های خود را به صورت صریح اعلام می‌کند.

## handlerهای مبتنی بر struct

برای برنامه‌هایی با وابستگی‌های مشترک زیاد، handlerها را در یک struct گروه‌بندی کنید:

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

## تزریق از طریق میان‌افزار

از میان‌افزار برای تزریق وابستگی‌ها به context درخواست استفاده کنید. این زمانی مفید است که handlerهای زیادی نیاز به یک وابستگی مشترک دارند:

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
الگوی میان‌افزار از `interface{}` و type assertion استفاده می‌کند که ایمنی نوع زمان کامپایل را از دست می‌دهد. در صورت امکان الگوهای closure یا struct را ترجیح دهید.
:::

## مقایسه الگوها

| الگو | ایمنی نوع | قابلیت تست | مناسب برای |
|---------|-------------|-------------|----------|
| Closure | زمان کامپایل | آسان برای mock | برنامه‌های کوچک، وابستگی‌های کم |
| Struct | زمان کامپایل | آسان برای mock | برنامه‌های متوسط تا بزرگ |
| میان‌افزار | زمان اجرا | متوسط | مسائل مشترک، حالت اشتراکی |

## تست با تزریق وابستگی

تمام الگوها تست را ساده می‌کنند -- جایگزین‌های تست را تزریق کنید:

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

## همچنین ببینید

- [یکپارچه‌سازی پایگاه داده](/en/docs/server-config/database/)
- [تست](/en/docs/testing/)
- [استفاده از میان‌افزار](/en/docs/middleware/using-middleware/)
