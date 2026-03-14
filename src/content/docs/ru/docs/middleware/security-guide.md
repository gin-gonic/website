---
title: "Лучшие практики безопасности"
sidebar:
  order: 8
---

Веб-приложения являются основной целью для злоумышленников. Приложение на Gin, которое обрабатывает пользовательский ввод, хранит данные или работает за обратным прокси, нуждается в целенаправленной настройке безопасности перед выходом в продакшн. Это руководство охватывает наиболее важные защиты и показывает, как применить каждую из них с помощью middleware Gin и стандартных библиотек Go.

:::note
Безопасность многоуровневая. Ни одна техника из этого списка не является достаточной сама по себе. Применяйте все соответствующие разделы для построения глубокой защиты.
:::

## Конфигурация CORS

Cross-Origin Resource Sharing (CORS) контролирует, какие внешние домены могут делать запросы к вашему API. Некорректно настроенный CORS может позволить вредоносным сайтам читать ответы с вашего сервера от имени аутентифицированных пользователей.

Используйте пакет [`gin-contrib/cors`](https://github.com/gin-contrib/cors) для проверенного решения.

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/api/data", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
Никогда не используйте `AllowOrigins: []string{"*"}` вместе с `AllowCredentials: true`. Это говорит браузерам, что любой сайт может делать аутентифицированные запросы к вашему API.
:::

## Защита от CSRF

Cross-Site Request Forgery обманывает браузер аутентифицированного пользователя, заставляя его отправлять нежелательные запросы к вашему приложению. Любой эндпоинт, изменяющий состояние (POST, PUT, DELETE), который полагается на cookies для аутентификации, нуждается в защите от CSRF.

Используйте middleware [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) для добавления защиты на основе токенов.

```go
package main

import (
  "github.com/gin-contrib/csrf"
  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  store := cookie.NewStore([]byte("session-secret"))
  r.Use(sessions.Sessions("mysession", store))

  r.Use(csrf.Middleware(csrf.Options{
    Secret: "csrf-token-secret",
    ErrorFunc: func(c *gin.Context) {
      c.String(403, "CSRF token mismatch")
      c.Abort()
    },
  }))

  r.GET("/form", func(c *gin.Context) {
    token := csrf.GetToken(c)
    c.JSON(200, gin.H{"csrf_token": token})
  })

  r.POST("/form", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "submitted"})
  })

  r.Run()
}
```

:::note
Защита от CSRF критически важна для приложений, использующих аутентификацию на основе cookies. API, которые полагаются исключительно на заголовки `Authorization` (например, Bearer-токены), не уязвимы для CSRF, поскольку браузеры не добавляют эти заголовки автоматически.
:::

## Ограничение частоты запросов

Ограничение частоты запросов предотвращает злоупотребления, атаки перебором и исчерпание ресурсов. Вы можете использовать пакет стандартной библиотеки `golang.org/x/time/rate` для создания простого middleware с ограничением частоты запросов по клиентам.

```go
package main

import (
  "net/http"
  "sync"

  "github.com/gin-gonic/gin"
  "golang.org/x/time/rate"
)

func RateLimiter() gin.HandlerFunc {
  type client struct {
    limiter *rate.Limiter
  }

  var (
    mu      sync.Mutex
    clients = make(map[string]*client)
  )

  return func(c *gin.Context) {
    ip := c.ClientIP()

    mu.Lock()
    if _, exists := clients[ip]; !exists {
      // Allow 10 requests per second with a burst of 20
      clients[ip] = &client{limiter: rate.NewLimiter(10, 20)}
    }
    cl := clients[ip]
    mu.Unlock()

    if !cl.limiter.Allow() {
      c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
        "error": "rate limit exceeded",
      })
      return
    }

    c.Next()
  }
}

func main() {
  r := gin.Default()
  r.Use(RateLimiter())

  r.GET("/api/resource", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
Пример выше хранит ограничители в map в памяти. В продакшне следует добавить периодическую очистку устаревших записей и рассмотреть распределённый ограничитель (например, на основе Redis), если вы запускаете несколько экземпляров приложения.
:::

## Валидация ввода и предотвращение SQL-инъекций

Всегда валидируйте и привязывайте ввод, используя привязку модели Gin с тегами структур. Никогда не конструируйте SQL-запросы путём конкатенации пользовательского ввода.

### Валидация ввода с тегами структур

```go
type CreateUser struct {
  Username string `json:"username" binding:"required,alphanum,min=3,max=30"`
  Email    string `json:"email"    binding:"required,email"`
  Age      int    `json:"age"      binding:"required,gte=1,lte=130"`
}

func createUserHandler(c *gin.Context) {
  var req CreateUser
  if err := c.ShouldBindJSON(&req); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  // req is now validated; proceed safely
}
```

### Используйте параметризованные запросы

```go
// DANGEROUS -- SQL injection vulnerability
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// SAFE -- parameterized query
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

Это относится к каждой библиотеке баз данных. Независимо от того, используете ли вы `database/sql`, GORM, sqlx или другую ORM, всегда используйте параметры-заполнители и никогда конкатенацию строк.

:::note
Валидация ввода и параметризованные запросы — это две ваши самые важные защиты от атак инъекций. Ни одна из них в отдельности не является достаточной — используйте обе.
:::

## Предотвращение XSS

Межсайтовый скриптинг (XSS) происходит, когда злоумышленник внедряет вредоносные скрипты, которые выполняются в браузерах других пользователей. Защищайтесь от этого на нескольких уровнях.

### Экранирование HTML-вывода

При рендеринге HTML-шаблонов пакет Go `html/template` экранирует вывод по умолчанию. Если вы возвращаете данные, предоставленные пользователем, в виде JSON, убедитесь, что заголовок `Content-Type` установлен правильно, чтобы браузеры не интерпретировали JSON как HTML.

```go
// Gin sets Content-Type automatically for JSON responses.
// Use c.JSON, not c.String, when returning structured data.
c.JSON(200, gin.H{"input": userInput})
```

### Используйте SecureJSON для защиты от JSONP

Gin предоставляет `c.SecureJSON`, который добавляет `while(1);` для предотвращения перехвата JSON.

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### Явно устанавливайте Content-Type при необходимости

```go
// For API endpoints, always return JSON
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

Заголовок `X-Content-Type-Options: nosniff` предотвращает определение MIME-типа браузерами, что не позволяет им интерпретировать ответ как HTML, когда сервер объявляет его как что-то другое.

## Middleware заголовков безопасности

Добавление заголовков безопасности — один из самых простых и эффективных шагов усиления защиты. Подробный пример см. на странице [Заголовки безопасности](/ru/docs/middleware/security-headers/). Ниже краткое описание основных заголовков.

```go
func SecurityHeaders() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Header("X-Frame-Options", "DENY")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Content-Security-Policy", "default-src 'self'")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("Permissions-Policy", "geolocation=(), camera=(), microphone=()")
    c.Next()
  }
}
```

| Заголовок | Что предотвращает |
|--------|-----------------|
| `X-Frame-Options: DENY` | Кликджекинг через iframe |
| `X-Content-Type-Options: nosniff` | Атаки с подменой MIME-типа |
| `Strict-Transport-Security` | Понижение протокола и перехват cookies |
| `Content-Security-Policy` | XSS и инъекция данных |
| `Referrer-Policy` | Утечка конфиденциальных параметров URL третьим сторонам |
| `Permissions-Policy` | Несанкционированное использование API браузера (камера, микрофон и т.д.) |

## Доверенные прокси

Когда ваше приложение работает за обратным прокси или балансировщиком нагрузки, вы должны указать Gin, каким прокси доверять. Без этой конфигурации злоумышленники могут подделать заголовок `X-Forwarded-For` для обхода контроля доступа на основе IP и ограничения частоты запросов.

```go
// Trust only your known proxy addresses
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

Подробное объяснение и параметры конфигурации см. на странице [Доверенные прокси](/ru/docs/server-config/trusted-proxies/).

## HTTPS и TLS

Все продакшн-приложения Gin должны обслуживать трафик через HTTPS. Gin поддерживает автоматические TLS-сертификаты через Let's Encrypt.

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... routes ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

Полные инструкции по настройке, включая пользовательские менеджеры сертификатов, см. на странице [Поддержка Let's Encrypt](/ru/docs/server-config/support-lets-encrypt/).

:::note
Всегда сочетайте HTTPS с заголовком `Strict-Transport-Security` (HSTS) для предотвращения атак понижения протокола. Как только заголовок HSTS установлен, браузеры откажутся подключаться по обычному HTTP.
:::

## Смотрите также

- [Заголовки безопасности](/ru/docs/middleware/security-headers/)
- [Доверенные прокси](/ru/docs/server-config/trusted-proxies/)
- [Поддержка Let's Encrypt](/ru/docs/server-config/support-lets-encrypt/)
- [Пользовательский middleware](/ru/docs/middleware/custom-middleware/)
- [Привязка и валидация](/ru/docs/binding/binding-and-validation/)
