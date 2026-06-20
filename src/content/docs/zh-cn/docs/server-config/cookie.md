---
title: "Cookie"
sidebar:
  order: 7
---

Gin 提供了在响应和请求中设置和读取 HTTP Cookie 的辅助方法。

### `SetCookie` 参数

`c.SetCookie()` 方法签名为：

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| 参数  | 描述 |
|------------|-------------|
| `name`     | Cookie 名称（键）。 |
| `value`    | Cookie 值。 |
| `maxAge`   | 生存时间（**秒**）。设置为 `-1` 删除 cookie，设置为 `0` 使其成为会话 cookie（浏览器关闭时删除）。 |
| `path`     | Cookie 有效的 URL 路径。使用 `"/"` 使其在整个站点范围内可用。 |
| `domain`   | Cookie 的作用域（例如 `"example.com"`）。开发时使用 `"localhost"`。 |
| `secure`   | 设为 `true` 时，cookie 仅通过 **HTTPS** 连接发送。**生产环境请设为 `true`。** |
| `httpOnly` | 设为 `true` 时，cookie 无法被客户端 JavaScript（`document.cookie`）访问，有助于防止 XSS 攻击。**生产环境请设为 `true`。** |

:::tip[生产建议]
在生产部署中，请设置 `Secure: true`、`HttpOnly: true` 和 `SameSite: Strict`（或 `Lax`），以最大限度地减少跨站请求伪造（CSRF）和跨站脚本（XSS）攻击的风险。
:::

### 设置和获取 Cookie

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

### 试一试

```bash
# First request -- no cookie sent, server sets one
curl -v http://localhost:8080/cookie
# Look for "Set-Cookie: gin_cookie=test" in the response headers

# Second request -- send the cookie back
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# Server logs: Cookie value: test
```

### 删除 Cookie

通过将 max age 设置为 `-1` 来删除 cookie。

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### 通过 http.Cookie 设置 cookie（v1.11+）

Gin 也支持使用 `*http.Cookie` 设置 cookie，可以访问 `Expires`、`MaxAge`、`SameSite` 和 `Partitioned` 等字段。

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

## 另请参阅

- [安全头](/zh-cn/docs/middleware/security-headers/)
