---
title: "FAQ"
sidebar:
  order: 9
---

## Общие вопросы

### Как включить горячую перезагрузку во время разработки?

Используйте [Air](https://github.com/cosmtrek/air) для автоматической горячей перезагрузки во время разработки. Air отслеживает ваши файлы и пересобирает/перезапускает приложение при обнаружении изменений.

**Установка:**

```sh
# Установить Air глобально
go install github.com/cosmtrek/air@latest
```

**Настройка:**

Создайте файл конфигурации `.air.toml` в корне проекта:

```sh
air init
```

Это создаст конфигурацию по умолчанию. Вы можете настроить её для вашего Gin проекта:

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

**Использование:**

Просто запустите `air` в директории проекта вместо `go run`:

```sh
air
```

Air будет отслеживать ваши `.go` файлы и автоматически пересобирать/перезапускать ваше Gin приложение при изменениях.

### Как обрабатывать CORS в Gin?

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

  // Конфигурация CORS по умолчанию
  r.Use(cors.Default())

  // Или настройте CORS
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

### Как раздавать статические файлы?

Используйте `Static()` или `StaticFS()` для раздачи статических файлов:

```go
func main() {
  r := gin.Default()

  // Раздавать файлы из директории ./assets по пути /assets/*
  r.Static("/assets", "./assets")

  // Раздавать один файл
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Раздавать из встроенной файловой системы (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

Подробнее см. [пример раздачи статических файлов](../examples/serving-static-files/).

### Как обрабатывать загрузку файлов?

Используйте `FormFile()` для одного файла или `MultipartForm()` для нескольких файлов:

```go
// Загрузка одного файла
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")

  // Сохранить файл
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)

  c.String(200, "Файл %s успешно загружен", file.Filename)
})

// Загрузка нескольких файлов
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }

  c.String(200, "Загружено %d файлов", len(files))
})
```

Подробнее см. [примеры загрузки файлов](../examples/upload-file/).

### Как реализовать аутентификацию с JWT?

Используйте [gin-contrib/jwt](https://github.com/gin-contrib/jwt) или реализуйте собственный middleware:

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
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Отсутствует токен авторизации"})
      c.Abort()
      return
    }

    // Удалить префикс "Bearer " если присутствует
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Недействительный токен"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Недействительные claims токена"})
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

    // Проверка учётных данных (реализуйте свою логику)
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверные учётные данные"})
    }
  })

  // Защищённые маршруты
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

### Как настроить логирование запросов?

Gin включает middleware логирования по умолчанию. Настройте его или используйте структурированное логирование:

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

// Пользовательский middleware логирования
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

Для продвинутого логирования см. [пример пользовательского формата лога](../examples/custom-log-format/).

### Как обработать graceful shutdown?

Реализуйте graceful shutdown для корректного закрытия соединений:

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
    c.String(http.StatusOK, "Добро пожаловать!")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }

  // Запустить сервер в горутине
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("прослушивание: %s\n", err)
    }
  }()

  // Ожидание сигнала прерывания для graceful shutdown сервера
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Завершение работы сервера...")

  // Дать незавершённым запросам 5 секунд на завершение
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("Принудительное завершение сервера:", err)
  }

  log.Println("Сервер завершил работу")
}
```

Подробнее см. [пример graceful restart или stop](../examples/graceful-restart-or-stop/).

### Почему я получаю "404 Not Found" вместо "405 Method Not Allowed"?

По умолчанию Gin возвращает 404 для маршрутов, не поддерживающих запрошенный HTTP метод. Чтобы возвращать 405 Method Not Allowed, включите опцию `HandleMethodNotAllowed`.

Подробнее см. [FAQ Method Not Allowed](./method-not-allowed/).

### Как связать параметры запроса и POST данные вместе?

Используйте `ShouldBind()`, который автоматически выбирает binding на основе типа контента:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // Связывает параметры запроса и тело запроса (JSON/form)
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

Для большего контроля см. [пример bind query или post](../examples/bind-query-or-post/).

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
  c.JSON(200, gin.H{"message": "Пользователь валиден"})
})
```

Для пользовательских валидаторов см. [пример пользовательских валидаторов](../examples/custom-validators/).

### Как запустить Gin в production режиме?

Установите переменную окружения `GIN_MODE` в `release`:

```sh
export GIN_MODE=release
# или
GIN_MODE=release ./your-app
```

Или установите программно:

```go
gin.SetMode(gin.ReleaseMode)
```

Release режим:

- Отключает отладочное логирование
- Улучшает производительность
- Немного уменьшает размер бинарного файла

### Как обрабатывать подключения к базе данных с Gin?

Используйте внедрение зависимостей или контекст для разделения подключений к базе данных:

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

  // Метод 1: Передать db в обработчики
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

  // Метод 2: Использовать middleware для внедрения db
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })

  r.Run()
}
```

Для ORM рассмотрите использование [GORM](https://gorm.io/) с Gin.

### Как тестировать обработчики Gin?

Используйте `net/http/httptest` для тестирования ваших маршрутов:

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

Больше примеров см. в [документации по тестированию](../testing/).

## Вопросы производительности

### Как оптимизировать Gin для высокой нагрузки?

1. **Используйте release режим**: Установите `GIN_MODE=release`
2. **Отключите ненужные middleware**: Используйте только то, что вам нужно
3. **Используйте `gin.New()` вместо `gin.Default()`** если хотите ручной контроль middleware
4. **Пул соединений**: Правильно настройте пул соединений с базой данных
5. **Кэширование**: Реализуйте кэширование для часто запрашиваемых данных
6. **Балансировка нагрузки**: Используйте обратный прокси (nginx, HAProxy)
7. **Профилирование**: Используйте pprof Go для определения узких мест

```go
r := gin.New()
r.Use(gin.Recovery()) // Использовать только recovery middleware

// Установить лимиты пула соединений
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### Готов ли Gin для production?

Да! Gin используется в production многими компаниями и проверен в боевых условиях в масштабе. Это один из самых популярных Go веб-фреймворков с:

- Активной поддержкой и сообществом
- Обширной экосистемой middleware
- Отличными показателями производительности
- Сильной обратной совместимостью

## Устранение неполадок

### Почему мои параметры маршрута не работают?

Убедитесь, что параметры маршрута используют синтаксис `:` и правильно извлекаются:

```go
// Правильно
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "ID пользователя: %s", id)
})

// Неправильно: /user/{id} или /user/<id>
```

### Почему мой middleware не выполняется?

Middleware должен быть зарегистрирован до маршрутов или групп маршрутов:

```go
// Правильный порядок
r := gin.New()
r.Use(MyMiddleware()) // Сначала зарегистрировать middleware
r.GET("/ping", handler) // Затем маршруты

// Для групп маршрутов
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Middleware для этой группы
{
  auth.GET("/dashboard", handler)
}
```

### Почему binding запроса не работает?

Распространённые причины:

1. **Отсутствуют теги binding**: Добавьте теги `json:"field"` или `form:"field"`
2. **Несоответствие Content-Type**: Убедитесь, что клиент отправляет правильный заголовок Content-Type
3. **Ошибки валидации**: Проверьте теги валидации и требования
4. **Неэкспортированные поля**: Только экспортированные (с заглавной буквы) поля структуры связываются

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Правильно
  Email string `json:"email"`                    // ✓ Правильно
  age   int    `json:"age"`                      // ✗ Не будет связано (неэкспортированное)
}
```
