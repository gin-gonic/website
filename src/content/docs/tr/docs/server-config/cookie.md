---
title: "Çerez"
sidebar:
  order: 7
---

Gin, yanıt ve istekte HTTP çerezlerini ayarlamak ve okumak için yardımcılar sağlar.

### `SetCookie` parametreleri

`c.SetCookie()` metod imzası şöyledir:

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| Parametre  | Açıklama |
|------------|----------|
| `name`     | Çerez adı (anahtar). |
| `value`    | Çerez değeri. |
| `maxAge`   | **Saniye** cinsinden yaşam süresi. Çerezi silmek için `-1`, tarayıcı kapandığında silinen bir oturum çerezi yapmak için `0` ayarlayın. |
| `path`     | Çerezin geçerli olduğu URL yolu. Site genelinde kullanılabilir kılmak için `"/"` kullanın. |
| `domain`   | Çerezin kapsamlandığı alan (ör., `"example.com"`). Geliştirme sırasında `"localhost"` kullanın. |
| `secure`   | `true` olduğunda, çerez yalnızca **HTTPS** bağlantıları üzerinden gönderilir. **Üretimde bunu `true` olarak ayarlayın.** |
| `httpOnly` | `true` olduğunda, çerez istemci tarafı JavaScript'e (`document.cookie`) erişilemez, bu XSS saldırılarını önlemeye yardımcı olur. **Üretimde bunu `true` olarak ayarlayın.** |

:::tip[Üretim önerisi]
Üretim dağıtımları için, cross-site request forgery (CSRF) ve cross-site scripting (XSS) saldırılarına maruz kalmayı en aza indirmek amacıyla `Secure: true`, `HttpOnly: true` ve `SameSite: Strict` (veya `Lax`) ayarlayın.
:::

### Çerez ayarlama ve alma

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

### Deneyin

```bash
# First request -- no cookie sent, server sets one
curl -v http://localhost:8080/cookie
# Look for "Set-Cookie: gin_cookie=test" in the response headers

# Second request -- send the cookie back
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# Server logs: Cookie value: test
```

### Çerezi silme

Max age'i `-1` olarak ayarlayarak bir çerezi silin.

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### http.Cookie ile çerez ayarlama (v1.11+)

Gin, `Expires`, `MaxAge`, `SameSite` ve `Partitioned` gibi alanlara erişim sağlayan bir `*http.Cookie` kullanarak çerez ayarlamayı da destekler.

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

## Ayrıca bakınız

- [Güvenlik başlıkları](/tr/docs/middleware/security-headers/)
