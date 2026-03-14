---
title: "هدرهای امنیتی"
sidebar:
  order: 7
---

استفاده از هدرهای امنیتی برای محافظت از برنامه وب شما در برابر آسیب‌پذیری‌های امنیتی رایج مهم است. این مثال نحوه اضافه کردن هدرهای امنیتی به برنامه Gin و همچنین نحوه جلوگیری از حملات مربوط به تزریق هدر Host (SSRF، تغییر مسیر باز) را نشان می‌دهد.

### هر هدر در برابر چه چیزی محافظت می‌کند

| هدر | هدف |
|--------|---------|
| `X-Content-Type-Options: nosniff` | از حملات sniffing نوع MIME جلوگیری می‌کند. بدون این هدر، مرورگرها ممکن است فایل‌ها را به عنوان نوع محتوای متفاوت از آنچه اعلام شده تفسیر کنند و به مهاجمان اجازه اجرای اسکریپت‌های مخرب پنهان شده به عنوان انواع فایل بی‌ضرر را بدهند (مثلاً آپلود `.jpg` که در واقع JavaScript است). |
| `X-Frame-Options: DENY` | با غیرفعال کردن بارگذاری صفحه در `<iframe>` از حملات clickjacking جلوگیری می‌کند. مهاجمان از clickjacking برای قرار دادن فریم‌های نامرئی روی صفحات قانونی استفاده می‌کنند و کاربران را فریب می‌دهند تا دکمه‌های مخفی را کلیک کنند (مثلاً "حذف حساب من"). |
| `Content-Security-Policy` | کنترل می‌کند مرورگر مجاز است کدام منابع (اسکریپت‌ها، استایل‌ها، تصاویر، فونت‌ها و غیره) را از کدام منابع بارگذاری کند. این یکی از مؤثرترین دفاع‌ها در برابر اسکریپت بین‌سایتی (XSS) است زیرا می‌تواند اسکریپت‌های inline را مسدود کرده و منابع اسکریپت را محدود کند. |
| `X-XSS-Protection: 1; mode=block` | فیلتر XSS داخلی مرورگر را فعال می‌کند. این هدر عمدتاً در مرورگرهای مدرن منسوخ شده است (Chrome XSS Auditor خود را در ۲۰۱۹ حذف کرد)، اما همچنان دفاع عمیق برای کاربران مرورگرهای قدیمی‌تر فراهم می‌کند. |
| `Strict-Transport-Security` | مرورگر را مجبور به استفاده از HTTPS برای تمام درخواست‌های آینده به دامنه برای مدت `max-age` مشخص شده می‌کند. این از حملات تنزل پروتکل و ربودن کوکی از طریق اتصالات HTTP ناامن جلوگیری می‌کند. دستورالعمل `includeSubDomains` این حفاظت را به تمام زیردامنه‌ها گسترش می‌دهد. |
| `Referrer-Policy: strict-origin` | کنترل می‌کند چه مقدار اطلاعات referrer با درخواست‌های خروجی ارسال شود. بدون این هدر، URL کامل (شامل پارامترهای پرس‌وجو که ممکن است شامل توکن‌ها یا داده‌های حساس باشند) می‌تواند به سایت‌های شخص ثالث نشت کند. `strict-origin` فقط مبدأ (دامنه) و فقط از طریق HTTPS ارسال می‌کند. |
| `Permissions-Policy` | محدود می‌کند کدام ویژگی‌های مرورگر (مکان‌یابی جغرافیایی، دوربین، میکروفون و غیره) می‌توانند توسط صفحه استفاده شوند. این آسیب را در صورت موفقیت مهاجم در تزریق اسکریپت‌ها محدود می‌کند، زیرا آن اسکریپت‌ها نمی‌توانند به APIهای حساس دستگاه دسترسی پیدا کنند. |

### مثال

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

می‌توانید با `curl` تست کنید:

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

به صورت اختیاری، از [gin helmet](https://github.com/danielkov/gin-helmet) استفاده کنید `go get github.com/danielkov/gin-helmet/ginhelmet`

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
