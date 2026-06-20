---
title: "Cookies"
sidebar:
  order: 7
---

Gin предоставляет вспомогательные методы для установки и чтения HTTP-cookies в ответе и запросе.

### Параметры `SetCookie`

Сигнатура метода `c.SetCookie()`:

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| Параметр   | Описание |
|------------|-------------|
| `name`     | Имя cookie (ключ). |
| `value`    | Значение cookie. |
| `maxAge`   | Время жизни в **секундах**. Установите `-1` для удаления cookie или `0` для создания сессионной cookie (удаляется при закрытии браузера). |
| `path`     | URL-путь, для которого cookie действителен. Используйте `"/"` для доступа на всём сайте. |
| `domain`   | Домен, к которому привязан cookie (например, `"example.com"`). Используйте `"localhost"` при разработке. |
| `secure`   | При `true` cookie отправляется только через **HTTPS** соединения. **Установите `true` в продакшне.** |
| `httpOnly` | При `true` cookie недоступен для клиентского JavaScript (`document.cookie`), что помогает предотвратить XSS-атаки. **Установите `true` в продакшне.** |

:::tip[Рекомендация для продакшна]
Для продакшн-развёртываний установите `Secure: true`, `HttpOnly: true` и `SameSite: Strict` (или `Lax`) для минимизации уязвимости к атакам CSRF и XSS.
:::

### Установка и получение cookie

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {

  router := gin.Default()

  router.GET("/cookie", func(c *gin.Context) {

    cookie, err := c.Cookie("gin_cookie")

    if err != nil {
      cookie = "NotSet"
      c.SetCookie("gin_cookie", "test", 3600, "/", "localhost", false, true)
    }

    fmt.Printf("Cookie value: %s \n", cookie)
  })

  router.Run()
}
```

### Попробуйте

```bash
# First request -- no cookie sent, server sets one
curl -v http://localhost:8080/cookie
# Look for "Set-Cookie: gin_cookie=test" in the response headers

# Second request -- send the cookie back
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# Server logs: Cookie value: test
```

### Удаление cookie

Удалите cookie, установив max age в `-1`.

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### Установка cookie через http.Cookie (v1.11+)

Gin также поддерживает установку cookies с помощью `*http.Cookie`, предоставляя доступ к полям `Expires`, `MaxAge`, `SameSite` и `Partitioned`.

```go
import (
  "net/http"
  "time"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  r.GET("/set-cookie", func(c *gin.Context) {
    c.SetCookieData(&http.Cookie{
      Name:   "session_id",
      Value:  "abc123",
      Path:   "/",
      Domain:   "localhost",
      Expires:  time.Now().Add(24 * time.Hour),
      MaxAge:   86400,
      Secure:   true,
      HttpOnly: true,
      SameSite: http.SameSiteLaxMode,
      // Partitioned: true, // Go 1.22+
    })
    c.String(http.StatusOK, "ok")
  })
  r.Run(":8080")
}
```

## Смотрите также

- [Заголовки безопасности](/ru/docs/middleware/security-headers/)
