---
title: "کوکی"
sidebar:
  order: 7
---

Gin توابع کمکی برای تنظیم و خواندن کوکی‌های HTTP در پاسخ و درخواست ارائه می‌دهد.

### پارامترهای `SetCookie`

امضای متد `c.SetCookie()` به شکل زیر است:

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| پارامتر | توضیحات |
|------------|-------------|
| `name`     | نام (کلید) کوکی. |
| `value`    | مقدار کوکی. |
| `maxAge`   | زمان حیات به **ثانیه**. `-1` برای حذف کوکی یا `0` برای کوکی نشست (هنگام بستن مرورگر حذف می‌شود). |
| `path`     | مسیر URL که کوکی برای آن معتبر است. از `"/"` برای دسترسی در کل سایت استفاده کنید. |
| `domain`   | دامنه‌ای که کوکی به آن محدود است (مثلاً `"example.com"`). در حین توسعه از `"localhost"` استفاده کنید. |
| `secure`   | وقتی `true` باشد، کوکی فقط از طریق اتصالات **HTTPS** ارسال می‌شود. **در تولید این را `true` تنظیم کنید.** |
| `httpOnly` | وقتی `true` باشد، کوکی برای JavaScript سمت کلاینت (`document.cookie`) غیرقابل دسترسی است که به جلوگیری از حملات XSS کمک می‌کند. **در تولید این را `true` تنظیم کنید.** |

:::tip[توصیه تولیدی]
برای استقرار تولیدی، `Secure: true`، `HttpOnly: true` و `SameSite: Strict` (یا `Lax`) تنظیم کنید تا قرارگیری در معرض حملات جعل درخواست بین‌سایتی (CSRF) و اسکریپت بین‌سایتی (XSS) به حداقل برسد.
:::

### تنظیم و دریافت کوکی

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

### امتحان کنید

```bash
# First request -- no cookie sent, server sets one
curl -v http://localhost:8080/cookie
# Look for "Set-Cookie: gin_cookie=test" in the response headers

# Second request -- send the cookie back
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# Server logs: Cookie value: test
```

### حذف کوکی

یک کوکی را با تنظیم حداکثر سن به `-1` حذف کنید.

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### تنظیم کوکی از طریق http.Cookie (نسخه v1.11+)

Gin همچنین از تنظیم کوکی‌ها با استفاده از `*http.Cookie` پشتیبانی می‌کند که دسترسی به فیلدهایی مانند `Expires`، `MaxAge`، `SameSite` و `Partitioned` را فراهم می‌کند.

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

## همچنین ببینید

- [هدرهای امنیتی](/fa/docs/middleware/security-headers/)
