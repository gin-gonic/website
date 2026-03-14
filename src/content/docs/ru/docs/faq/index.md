---
title: "FAQ"
sidebar:
  order: 15
---

## Общие вопросы

### Как включить автоперезагрузку при разработке?

Используйте [Air](https://github.com/air-verse/air) для автоматической перезагрузки при разработке. Air отслеживает ваши файлы и пересобирает/перезапускает приложение при обнаружении изменений.

**Установка:**

```sh
go install github.com/air-verse/air@latest
```

**Настройка:**

Создайте файл конфигурации `.air.toml` в корне вашего проекта:

```sh
air init
```

Затем запустите `air` в директории проекта вместо `go run`:

```sh
air
```

Air будет отслеживать ваши файлы `.go` и автоматически пересобирать/перезапускать ваше приложение Gin при изменениях. Смотрите [документацию Air](https://github.com/air-verse/air) для параметров конфигурации.

### Как настроить CORS в Gin?

Используйте официальный middleware [gin-contrib/cors](https://github.com/gin-contrib/cors):

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Default CORS configuration
  r.Use(cors.Default())

  // Or customize CORS settings
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

Полный обзор безопасности см. в разделе [Лучшие практики безопасности](/ru/docs/middleware/security-guide/).

### Как раздавать статические файлы?

Используйте `Static()` или `StaticFS()` для раздачи статических файлов:

```go
func main() {
  r := gin.Default()

  // Serve files from ./assets directory at /assets/*
  r.Static("/assets", "./assets")

  // Serve a single file
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Serve from embedded filesystem (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

Подробнее см. [Раздача данных из файла](/ru/docs/rendering/serving-data-from-file/).

### Как обрабатывать загрузку файлов?

Используйте `FormFile()` для одного файла или `MultipartForm()` для нескольких файлов:

```go
// Single file upload
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  c.String(200, "File %s uploaded successfully", file.Filename)
})

// Multiple files upload
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }
  c.String(200, "%d files uploaded", len(files))
})
```

Подробнее см. документацию [Загрузка файлов](/ru/docs/routing/upload-file/).

### Как реализовать аутентификацию с JWT?

Используйте [gin-contrib/jwt](https://github.com/gin-contrib/jwt) или реализуйте пользовательский middleware. Вот минимальный пример:

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

    // Remove "Bearer " prefix if present
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

Для аутентификации на основе сессий см. [Управление сессиями](/ru/docs/middleware/session-management/).

### Как настроить логирование запросов?

Gin включает middleware логирования по умолчанию через `gin.Default()`. Для структурированного JSON-логирования в продакшене см. [Структурированное логирование](/ru/docs/logging/structured-logging/).

Для базовой настройки логов:

```go
r := gin.New()
r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
  SkipPaths: []string{"/healthz"},
}))
r.Use(gin.Recovery())
```

Все варианты, включая пользовательские форматы, вывод в файл и исключение строк запроса, см. в разделе [Логирование](/ru/docs/logging/).

### Как реализовать плавную остановку?

См. [Плавная перезагрузка или остановка](/ru/docs/server-config/graceful-restart-or-stop/) для полного руководства с примерами кода.

### Почему я получаю "404 Not Found" вместо "405 Method Not Allowed"?

По умолчанию Gin возвращает 404 для маршрутов, которые не поддерживают запрашиваемый HTTP-метод. Установите `HandleMethodNotAllowed = true`, чтобы возвращать 405:

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

### Как привязать параметры запроса и POST-данные одновременно?

Используйте `ShouldBind()`, который автоматически выбирает привязку на основе типа контента:

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

Все варианты привязки см. в разделе [Привязка данных](/ru/docs/binding/).

### Как валидировать данные запроса?

Gin использует [go-playground/validator](https://github.com/go-playground/validator) для валидации. Добавьте теги валидации к вашим структурам:

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

Пользовательские валидаторы и продвинутое использование см. в разделе [Привязка модели и валидация](/ru/docs/binding/binding-and-validation/).

### Как запустить Gin в продакшен-режиме?

Установите переменную окружения `GIN_MODE` в значение `release`:

```sh
export GIN_MODE=release
# или
GIN_MODE=release ./your-app
```

Или установите программно:

```go
gin.SetMode(gin.ReleaseMode)
```

Режим release отключает отладочное логирование и улучшает производительность.

### Как обрабатывать подключения к базе данных с Gin?

См. [Интеграция с базой данных](/ru/docs/server-config/database/) для полного руководства, охватывающего `database/sql`, GORM, пул соединений и паттерны внедрения зависимостей.

### Как тестировать обработчики Gin?

Используйте `net/http/httptest` для тестирования маршрутов:

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

Больше примеров см. в документации [Тестирование](/ru/docs/testing/).

## Вопросы о производительности

### Как оптимизировать Gin для высокой нагрузки?

1. **Используйте режим Release**: Установите `GIN_MODE=release`
2. **Отключите ненужные middleware**: Используйте только то, что вам нужно
3. **Используйте `gin.New()` вместо `gin.Default()`** для ручного управления middleware
4. **Пул соединений**: Настройте пулы соединений к базе данных (см. [Интеграция с базой данных](/ru/docs/server-config/database/))
5. **Кеширование**: Реализуйте кеширование для часто запрашиваемых данных
6. **Балансировка нагрузки**: Используйте обратный прокси (nginx, HAProxy)
7. **Профилирование**: Используйте pprof из Go для выявления узких мест
8. **Мониторинг**: Настройте [метрики и мониторинг](/ru/docs/server-config/metrics/) для отслеживания производительности

### Готов ли Gin к продакшену?

Да. Gin используется в продакшене многими компаниями и проверен под высокими нагрузками. Примеры проектов, использующих Gin в продакшене, см. в разделе [Пользователи](/ru/docs/users/).

## Устранение неполадок

### Почему мои параметры маршрута не работают?

Убедитесь, что параметры маршрута используют синтаксис `:` и правильно извлекаются:

```go
// Correct
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// Not: /user/{id} or /user/<id>
```

Подробнее см. [Параметры в пути](/ru/docs/routing/param-in-path/).

### Почему мой middleware не выполняется?

Middleware должен быть зарегистрирован до маршрутов или групп маршрутов:

```go
// Correct order
r := gin.New()
r.Use(MyMiddleware()) // Register middleware first
r.GET("/ping", handler) // Then routes

// For route groups
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Middleware for this group
{
  auth.GET("/dashboard", handler)
}
```

Подробнее см. [Использование middleware](/ru/docs/middleware/using-middleware/).

### Почему привязка запроса не работает?

Частые причины:

1. **Отсутствуют теги привязки**: Добавьте теги `json:"field"` или `form:"field"`
2. **Несоответствие Content-Type**: Убедитесь, что клиент отправляет правильный заголовок Content-Type
3. **Ошибки валидации**: Проверьте теги и правила валидации
4. **Неэкспортируемые поля**: Привязываются только экспортируемые (с заглавной буквы) поля структуры

```go
type User struct {
  Name  string `json:"name" binding:"required"` // Correct
  Email string `json:"email"`                    // Correct
  age   int    `json:"age"`                      // Won't bind (unexported)
}
```

Подробнее см. [Привязка модели и валидация](/ru/docs/binding/binding-and-validation/).
