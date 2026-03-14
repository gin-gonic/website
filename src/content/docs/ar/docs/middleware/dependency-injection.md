---
title: "أنماط حقن الاعتماديات"
sidebar:
  order: 10
---

مع نمو تطبيق Gin، تحتاج طريقة نظيفة لمشاركة الاعتماديات مثل اتصالات قاعدة البيانات والتكوين والخدمات عبر المعالجات. تشجع بساطة Go على أنماط مباشرة بدلاً من أطر DI ثقيلة.

## نمط الإغلاق

أكثر نهج Go اصطلاحاً: تمرير الاعتماديات عبر الإغلاقات.

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

يعمل هذا النمط جيداً للتطبيقات الصغيرة والمتوسطة. كل معالج يُصرّح صراحة عن اعتمادياته.

## معالجات مبنية على الهياكل

للتطبيقات ذات الاعتماديات المشتركة الكثيرة، جمّع المعالجات في هيكل:

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

## حقن عبر الوسيطات

استخدم الوسيطات لحقن الاعتماديات في سياق الطلب. هذا مفيد عندما يحتاج كثير من المعالجات نفس الاعتمادية:

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
نمط الوسيطات يستخدم `interface{}` وتأكيدات الأنواع، مما يفقد سلامة الأنواع وقت الترجمة. فضّل أنماط الإغلاق أو الهياكل عندما يكون ذلك ممكناً.
:::

## مقارنة الأنماط

| النمط | سلامة الأنواع | قابلية الاختبار | الأفضل لـ |
|---------|-------------|-------------|----------|
| الإغلاق | وقت الترجمة | سهل المحاكاة | تطبيقات صغيرة، اعتماديات قليلة |
| الهيكل | وقت الترجمة | سهل المحاكاة | تطبيقات متوسطة-كبيرة |
| الوسيطات | وقت التشغيل | متوسط | المهام المشتركة، الحالة المشتركة |

## الاختبار مع حقن الاعتماديات

جميع الأنماط تجعل الاختبار مباشراً -- احقن بدائل الاختبار:

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

## انظر أيضاً

- [تكامل قاعدة البيانات](/ar/docs/server-config/database/)
- [الاختبار](/ar/docs/testing/)
- [استخدام الوسيطات](/ar/docs/middleware/using-middleware/)
