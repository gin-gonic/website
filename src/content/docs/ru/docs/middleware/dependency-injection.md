---
title: "Паттерны внедрения зависимостей"
sidebar:
  order: 10
---

По мере роста вашего приложения на Gin вам нужен чистый способ разделять зависимости, такие как подключения к базам данных, конфигурацию и сервисы, между обработчиками. Простота Go поощряет использование простых паттернов вместо тяжёлых DI-фреймворков.

## Паттерн замыкания

Наиболее идиоматичный подход в Go: передача зависимостей через замыкания.

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

Этот паттерн хорошо работает для малых и средних приложений. Каждый обработчик явно объявляет свои зависимости.

## Обработчики на основе структур

Для приложений с множеством общих зависимостей сгруппируйте обработчики в структуру:

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

## Внедрение через middleware

Используйте middleware для внедрения зависимостей в контекст запроса. Это полезно, когда многим обработчикам нужна одна и та же зависимость:

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
Паттерн middleware использует `interface{}` и приведение типов, что теряет типобезопасность на этапе компиляции. Предпочитайте паттерны замыкания или структуры, когда это возможно.
:::

## Сравнение паттернов

| Паттерн | Типобезопасность | Тестируемость | Лучше всего для |
|---------|-------------|-------------|----------|
| Замыкание | На этапе компиляции | Легко мокировать | Малые приложения, мало зависимостей |
| Структура | На этапе компиляции | Легко мокировать | Средние и большие приложения |
| Middleware | Во время выполнения | Умеренная | Сквозные задачи, общее состояние |

## Тестирование с внедрением зависимостей

Все паттерны делают тестирование простым — внедряйте тестовые заглушки:

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

## Смотрите также

- [Интеграция с базой данных](/ru/docs/server-config/database/)
- [Тестирование](/ru/docs/testing/)
- [Использование middleware](/ru/docs/middleware/using-middleware/)
