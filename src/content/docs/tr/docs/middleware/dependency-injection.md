---
title: "Bağımlılık Enjeksiyonu Kalıpları"
sidebar:
  order: 10
---

Gin uygulamanız büyüdükçe, veritabanı bağlantıları, yapılandırma ve servisler gibi bağımlılıkları işleyiciler arasında paylaşmanın temiz bir yoluna ihtiyaç duyarsınız. Go'nun sadeliği, ağır DI framework'leri yerine doğrudan kalıpları teşvik eder.

## Closure kalıbı

En deyimsel Go yaklaşımı: bağımlılıkları closure'lar aracılığıyla geçirin.

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

Bu kalıp küçük ve orta ölçekli uygulamalar için iyi çalışır. Her işleyici bağımlılıklarını açıkça bildirir.

## Struct tabanlı işleyiciler

Birçok paylaşılan bağımlılığa sahip uygulamalar için işleyicileri bir struct'ta gruplayın:

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

## Ara katman enjeksiyonu

Bağımlılıkları istek context'ine enjekte etmek için ara katman kullanın. Birçok işleyicinin aynı bağımlılığa ihtiyaç duyduğu durumlarda faydalıdır:

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
Ara katman kalıbı, derleme zamanı tür güvenliğini kaybeden `interface{}` ve tür dönüşümleri kullanır. Mümkün olduğunda closure veya struct kalıplarını tercih edin.
:::

## Kalıpları karşılaştırma

| Kalıp | Tür güvenliği | Test edilebilirlik | En uygun |
|-------|---------------|-------------------|----------|
| Closure | Derleme zamanı | Mock'lamak kolay | Küçük uygulamalar, az bağımlılık |
| Struct | Derleme zamanı | Mock'lamak kolay | Orta-büyük uygulamalar |
| Ara katman | Çalışma zamanı | Orta | Çapraz kesen konular, paylaşılan durum |

## Bağımlılık enjeksiyonu ile test etme

Tüm kalıplar testi kolaylaştırır -- test çiftlerini enjekte edin:

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

## Ayrıca bakınız

- [Veritabanı entegrasyonu](/tr/docs/server-config/database/)
- [Test](/tr/docs/testing/)
- [Ara katman kullanımı](/tr/docs/middleware/using-middleware/)
