---
title: "Pola Dependency Injection"
sidebar:
  order: 10
---

Seiring aplikasi Gin Anda berkembang, Anda memerlukan cara yang bersih untuk berbagi dependensi seperti koneksi database, konfigurasi, dan layanan di seluruh handler. Kesederhanaan Go mendorong pola langsung dibanding framework DI yang berat.

## Pola closure

Pendekatan Go yang paling idiomatis: teruskan dependensi melalui closure.

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

Pola ini bekerja dengan baik untuk aplikasi kecil hingga menengah. Setiap handler secara eksplisit mendeklarasikan dependensinya.

## Handler berbasis struct

Untuk aplikasi dengan banyak dependensi bersama, kelompokkan handler dalam struct:

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

## Injeksi middleware

Gunakan middleware untuk menyuntikkan dependensi ke context permintaan. Ini berguna ketika banyak handler membutuhkan dependensi yang sama:

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
Pola middleware menggunakan `interface{}` dan type assertion, yang kehilangan keamanan tipe pada waktu kompilasi. Utamakan pola closure atau struct bila memungkinkan.
:::

## Perbandingan pola

| Pola | Keamanan tipe | Testabilitas | Terbaik untuk |
|------|---------------|-------------|---------------|
| Closure | Waktu kompilasi | Mudah di-mock | Aplikasi kecil, sedikit dependensi |
| Struct | Waktu kompilasi | Mudah di-mock | Aplikasi menengah-besar |
| Middleware | Runtime | Sedang | Kepentingan lintas-sektoral, state bersama |

## Pengujian dengan dependency injection

Semua pola membuat pengujian mudah -- suntikkan test double:

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

## Lihat juga

- [Integrasi database](/id/docs/server-config/database/)
- [Pengujian](/id/docs/testing/)
- [Menggunakan middleware](/id/docs/middleware/using-middleware/)
