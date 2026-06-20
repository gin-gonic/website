---
title: "ملفات تعريف الارتباط"
sidebar:
  order: 7
---

Gin provides helpers to set and read HTTP cookies on the response and request.

### `SetCookie` parameters

The `c.SetCookie()` method signature is:

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| Parameter  | Description |
|------------|-------------|
| `name`     | The cookie name (key). |
| `value`    | The cookie value. |
| `maxAge`   | Time-to-live in **seconds**. Set to `-1` to delete the cookie, or `0` to make it a session cookie (deleted when the browser closes). |
| `path`     | The URL path the cookie is valid for. Use `"/"` to make it available site-wide. |
| `domain`   | The domain the cookie is scoped to (e.g., `"example.com"`). Use `"localhost"` during development. |
| `secure`   | When `true`, the cookie is only sent over **HTTPS** connections. **Set this to `true` in production.** |
| `httpOnly` | When `true`, the cookie is inaccessible to client-side JavaScript (`document.cookie`), which helps prevent XSS attacks. **Set this to `true` in production.** |

:::tip[Production recommendation]
For production deployments, set `Secure: true`, `HttpOnly: true`, and `SameSite: Strict` (or `Lax`) to minimize exposure to cross-site request forgery (CSRF) and cross-site scripting (XSS) attacks.
:::

### Set and get a cookie

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

### Try it

```bash
# First request -- no cookie sent, server sets one
curl -v http://localhost:8080/cookie
# Look for "Set-Cookie: gin_cookie=test" in the response headers

# Second request -- send the cookie back
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# Server logs: Cookie value: test
```

### Delete a cookie

Delete a cookie by setting max age to `-1`.

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### Set cookie via http.Cookie (v1.11+)

Gin also supports setting cookies using an `*http.Cookie`, giving access to fields like `Expires`, `MaxAge`, `SameSite`, and `Partitioned`.

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

## See also

- [Security headers](/en/docs/middleware/security-headers/)
