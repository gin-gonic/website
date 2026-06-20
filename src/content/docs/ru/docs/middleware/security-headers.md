---
title: "Заголовки безопасности"
sidebar:
  order: 7
---

Важно использовать заголовки безопасности для защиты вашего веб-приложения от распространённых уязвимостей. Этот пример показывает, как добавить заголовки безопасности в ваше приложение Gin, а также как избежать атак, связанных с инъекцией заголовка Host (SSRF, Open Redirection).

### Что защищает каждый заголовок

| Заголовок | Назначение |
|--------|---------|
| `X-Content-Type-Options: nosniff` | Предотвращает атаки с подменой MIME-типа. Без этого заголовка браузеры могут интерпретировать файлы как тип контента, отличный от объявленного, позволяя злоумышленникам выполнять вредоносные скрипты, замаскированные под безобидные типы файлов (например, загрузка `.jpg`, который на самом деле является JavaScript). |
| `X-Frame-Options: DENY` | Предотвращает кликджекинг, запрещая загрузку страницы внутри `<iframe>`. Злоумышленники используют кликджекинг для наложения невидимых фреймов на легитимные страницы, обманывая пользователей нажимать скрытые кнопки (например, «Удалить мой аккаунт»). |
| `Content-Security-Policy` | Контролирует, какие ресурсы (скрипты, стили, изображения, шрифты и т.д.) браузер может загружать и из каких источников. Это одна из наиболее эффективных защит от межсайтового скриптинга (XSS), поскольку может блокировать встроенные скрипты и ограничивать источники скриптов. |
| `X-XSS-Protection: 1; mode=block` | Активирует встроенный XSS-фильтр браузера. Этот заголовок в основном устарел в современных браузерах (Chrome удалил свой XSS Auditor в 2019 году), но по-прежнему обеспечивает глубокую защиту для пользователей старых браузеров. |
| `Strict-Transport-Security` | Заставляет браузер использовать HTTPS для всех будущих запросов к домену в течение указанного `max-age`. Это предотвращает атаки понижения протокола и перехват cookies через незащищённые HTTP-соединения. Директива `includeSubDomains` распространяет эту защиту на все поддомены. |
| `Referrer-Policy: strict-origin` | Контролирует, сколько информации о реферере отправляется с исходящими запросами. Без этого заголовка полный URL (включая параметры запроса, которые могут содержать токены или конфиденциальные данные) может утечь на сторонние сайты. `strict-origin` отправляет только источник (домен) и только по HTTPS. |
| `Permissions-Policy` | Ограничивает, какие функции браузера (геолокация, камера, микрофон и т.д.) могут использоваться страницей. Это ограничивает ущерб, если злоумышленнику удастся внедрить скрипты, поскольку эти скрипты не смогут получить доступ к чувствительным API устройства. |

### Пример

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  expectedHost := "localhost:8080"

  // Setup Security Headers
  r.Use(func(c *gin.Context) {
    if c.Request.Host != expectedHost {
      c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
      return
    }
    c.Header("X-Frame-Options", "DENY")
    c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
    c.Header("X-XSS-Protection", "1; mode=block")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
    c.Next()
  })

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run() // listen and serve on 0.0.0.0:8080
}
```

Вы можете проверить через `curl`:

```bash
// Check Headers

curl localhost:8080/ping -I

HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';
Content-Type: text/plain
Permissions-Policy: geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()
Referrer-Policy: strict-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Xss-Protection: 1; mode=block
Date: Sat, 30 Mar 2024 08:20:44 GMT
Content-Length: 18

// Check Host Header Injection

curl localhost:8080/ping -I -H "Host:neti.ee"

HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Date: Sat, 30 Mar 2024 08:21:09 GMT
Content-Length: 31
```

Опционально используйте [gin helmet](https://github.com/danielkov/gin-helmet) `go get github.com/danielkov/gin-helmet/ginhelmet`

```go
package main

import (
  "github.com/gin-gonic/gin"
  "github.com/danielkov/gin-helmet/ginhelmet"
)

func main() {
  r := gin.Default()

  // Use default security headers
  r.Use(ginhelmet.Default())

  r.GET("/", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello, World!"})
  })

  r.Run()
}
```
