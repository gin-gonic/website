---
title: "Cookie"
sidebar:
  order: 7
---

Gin 提供了輔助方法來設定和讀取回應與請求中的 HTTP Cookie。

### `SetCookie` 參數

`c.SetCookie()` 方法簽名為：

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| 參數  | 說明 |
|------------|-------------|
| `name`     | Cookie 名稱（鍵）。 |
| `value`    | Cookie 值。 |
| `maxAge`   | 存活時間（**秒**）。設為 `-1` 刪除 Cookie，設為 `0` 則為 Session Cookie（瀏覽器關閉時刪除）。 |
| `path`     | Cookie 有效的 URL 路徑。使用 `"/"` 使其在整個網站可用。 |
| `domain`   | Cookie 所屬的網域（例如 `"example.com"`）。開發時使用 `"localhost"`。 |
| `secure`   | 設為 `true` 時，Cookie 僅透過 **HTTPS** 連線傳送。**在正式環境中請設為 `true`。** |
| `httpOnly` | 設為 `true` 時，Cookie 無法被客戶端 JavaScript（`document.cookie`）存取，有助於防止 XSS 攻擊。**在正式環境中請設為 `true`。** |

:::tip[正式環境建議]
對於正式環境部署，設定 `Secure: true`、`HttpOnly: true` 和 `SameSite: Strict`（或 `Lax`）以最小化跨站請求偽造（CSRF）和跨站腳本（XSS）攻擊的風險。
:::

### 設定和取得 Cookie

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

### 測試

```bash
# First request -- no cookie sent, server sets one
curl -v http://localhost:8080/cookie
# Look for "Set-Cookie: gin_cookie=test" in the response headers

# Second request -- send the cookie back
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# Server logs: Cookie value: test
```

### 刪除 Cookie

透過設定 max age 為 `-1` 來刪除 Cookie。

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### 透過 http.Cookie 設定 Cookie（v1.11+）

Gin 也支援使用 `*http.Cookie` 設定 Cookie，可以存取 `Expires`、`MaxAge`、`SameSite` 和 `Partitioned` 等欄位。

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

## 另請參閱

- [安全標頭](/zh-tw/docs/middleware/security-headers/)
