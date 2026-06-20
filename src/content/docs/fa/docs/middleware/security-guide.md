---
title: "بهترین روش‌های امنیتی"
sidebar:
  order: 8
---

برنامه‌های وب هدف اصلی مهاجمان هستند. یک برنامه Gin که ورودی کاربر را مدیریت می‌کند، داده‌ها را ذخیره می‌کند یا پشت یک پروکسی معکوس اجرا می‌شود، قبل از رفتن به تولید نیاز به پیکربندی امنیتی عمدی دارد. این راهنما مهم‌ترین دفاع‌ها را پوشش می‌دهد و نحوه اعمال هر کدام را با میان‌افزار Gin و کتابخانه‌های استاندارد Go نشان می‌دهد.

:::note
امنیت لایه‌ای است. هیچ تکنیک واحدی در این لیست به تنهایی کافی نیست. تمام بخش‌های مرتبط را برای ساخت دفاع عمیق اعمال کنید.
:::

## پیکربندی CORS

اشتراک منابع بین‌مبدأ (CORS) کنترل می‌کند کدام دامنه‌های خارجی می‌توانند به API شما درخواست ارسال کنند. CORS نادرست پیکربندی شده می‌تواند به وب‌سایت‌های مخرب اجازه دهد پاسخ‌ها را از سرور شما به نمایندگی از کاربران احراز هویت شده بخوانند.

از پکیج [`gin-contrib/cors`](https://github.com/gin-contrib/cors) برای یک راه‌حل آزموده شده استفاده کنید.

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
هرگز `AllowOrigins: []string{"*"}` را همراه با `AllowCredentials: true` استفاده نکنید. این به مرورگرها می‌گوید که هر سایتی می‌تواند درخواست‌های احراز هویت شده به API شما ارسال کند.
:::

## محافظت CSRF

جعل درخواست بین‌سایتی مرورگر کاربر احراز هویت شده را فریب می‌دهد تا درخواست‌های ناخواسته به برنامه شما ارسال کند. هر نقطه پایانی تغییردهنده وضعیت (POST، PUT، DELETE) که برای احراز هویت بر کوکی‌ها تکیه دارد نیاز به محافظت CSRF دارد.

از میان‌افزار [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) برای اضافه کردن محافظت مبتنی بر توکن استفاده کنید.

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
محافظت CSRF برای برنامه‌هایی که از احراز هویت مبتنی بر کوکی استفاده می‌کنند حیاتی است. APIهایی که تنها بر هدرهای `Authorization` (مثلاً توکن‌های Bearer) تکیه دارند در برابر CSRF آسیب‌پذیر نیستند زیرا مرورگرها آن هدرها را به طور خودکار ضمیمه نمی‌کنند.
:::

## محدودیت نرخ

محدودیت نرخ از سوءاستفاده، حملات brute-force و فرسودگی منابع جلوگیری می‌کند. می‌توانید از پکیج `golang.org/x/time/rate` کتابخانه استاندارد برای ساخت یک محدودکننده نرخ ساده به ازای هر کلاینت به عنوان میان‌افزار استفاده کنید.

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
مثال بالا محدودکننده‌ها را در یک map حافظه‌ای ذخیره می‌کند. در تولید، باید پاکسازی دوره‌ای ورودی‌های قدیمی را اضافه کنید و اگر چندین نمونه برنامه اجرا می‌کنید، یک محدودکننده نرخ توزیع‌شده (مثلاً مبتنی بر Redis) را در نظر بگیرید.
:::

## اعتبارسنجی ورودی و جلوگیری از تزریق SQL

همیشه ورودی را با استفاده از اتصال مدل Gin با تگ‌های struct اعتبارسنجی و متصل کنید. هرگز پرس‌وجوهای SQL را با الحاق ورودی کاربر نسازید.

### اعتبارسنجی ورودی با تگ‌های struct

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

### استفاده از پرس‌وجوهای پارامتری

```go
// DANGEROUS -- SQL injection vulnerability
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// SAFE -- parameterized query
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

این برای هر کتابخانه پایگاه داده صدق می‌کند. چه از `database/sql`، GORM، sqlx یا ORM دیگری استفاده کنید، همیشه از جای‌نگهنده‌های پارامتری استفاده کنید و هرگز الحاق رشته نکنید.

:::note
اعتبارسنجی ورودی و پرس‌وجوهای پارامتری دو مهم‌ترین دفاع شما در برابر حملات تزریق هستند. هیچ‌کدام به تنهایی کافی نیست -- از هر دو استفاده کنید.
:::

## جلوگیری از XSS

اسکریپت بین‌سایتی (XSS) زمانی رخ می‌دهد که مهاجم اسکریپت‌های مخرب تزریق می‌کند که در مرورگرهای کاربران دیگر اجرا می‌شوند. در چندین لایه از آن دفاع کنید.

### فرار از خروجی HTML

هنگام رندرینگ قالب‌های HTML، پکیج `html/template` Go به طور پیش‌فرض خروجی را فرار می‌دهد. اگر داده‌های ارائه شده توسط کاربر را به عنوان JSON برمی‌گردانید، مطمئن شوید هدر `Content-Type` به درستی تنظیم شده تا مرورگرها JSON را به عنوان HTML تفسیر نکنند.

```go
// Gin sets Content-Type automatically for JSON responses.
// Use c.JSON, not c.String, when returning structured data.
c.JSON(200, gin.H{"input": userInput})
```

### استفاده از SecureJSON برای محافظت JSONP

Gin متد `c.SecureJSON` را ارائه می‌دهد که `while(1);` را برای جلوگیری از ربودن JSON اضافه می‌کند.

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### تنظیم صریح Content-Type در صورت نیاز

```go
// For API endpoints, always return JSON
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

هدر `X-Content-Type-Options: nosniff` از sniffing نوع MIME توسط مرورگرها جلوگیری می‌کند که آن‌ها را از تفسیر پاسخ به عنوان HTML در حالی که سرور آن را به عنوان چیز دیگری اعلام کرده متوقف می‌کند.

## میان‌افزار هدرهای امنیتی

اضافه کردن هدرهای امنیتی یکی از ساده‌ترین و مؤثرترین گام‌های سخت‌سازی است. صفحه کامل [هدرهای امنیتی](/en/docs/middleware/security-headers/) را برای مثال دقیق ببینید. در زیر خلاصه‌ای از هدرهای ضروری آمده است.

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

| هدر | از چه چیزی جلوگیری می‌کند |
|--------|-----------------|
| `X-Frame-Options: DENY` | Clickjacking از طریق iframeها |
| `X-Content-Type-Options: nosniff` | حملات sniffing نوع MIME |
| `Strict-Transport-Security` | تنزل پروتکل و ربودن کوکی |
| `Content-Security-Policy` | XSS و تزریق داده |
| `Referrer-Policy` | نشت پارامترهای حساس URL به اشخاص ثالث |
| `Permissions-Policy` | استفاده غیرمجاز از APIهای مرورگر (دوربین، میکروفون و غیره) |

## پروکسی‌های مورد اعتماد

وقتی برنامه شما پشت پروکسی معکوس یا متعادل‌کننده بار اجرا می‌شود، باید به Gin بگویید به کدام پروکسی‌ها اعتماد کند. بدون این پیکربندی، مهاجمان می‌توانند هدر `X-Forwarded-For` را جعل کنند تا کنترل‌های دسترسی مبتنی بر IP و محدودیت نرخ را دور بزنند.

```go
// Trust only your known proxy addresses
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

صفحه [پروکسی‌های مورد اعتماد](/en/docs/server-config/trusted-proxies/) را برای توضیح کامل و گزینه‌های پیکربندی ببینید.

## HTTPS و TLS

تمام برنامه‌های Gin تولیدی باید ترافیک را از طریق HTTPS ارائه دهند. Gin از گواهی‌های TLS خودکار از طریق Let's Encrypt پشتیبانی می‌کند.

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... routes ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

صفحه [پشتیبانی از Let's Encrypt](/en/docs/server-config/support-lets-encrypt/) را برای دستورالعمل‌های کامل راه‌اندازی شامل مدیران گواهی سفارشی ببینید.

:::note
همیشه HTTPS را با هدر `Strict-Transport-Security` (HSTS) ترکیب کنید تا از حملات تنزل پروتکل جلوگیری شود. وقتی هدر HSTS تنظیم شود، مرورگرها از اتصال از طریق HTTP ساده خودداری خواهند کرد.
:::

## همچنین ببینید

- [هدرهای امنیتی](/en/docs/middleware/security-headers/)
- [پروکسی‌های مورد اعتماد](/en/docs/server-config/trusted-proxies/)
- [پشتیبانی از Let's Encrypt](/en/docs/server-config/support-lets-encrypt/)
- [میان‌افزار سفارشی](/en/docs/middleware/custom-middleware/)
- [اتصال و اعتبارسنجی](/en/docs/binding/binding-and-validation/)
