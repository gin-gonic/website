---
title: "أفضل ممارسات الأمان"
sidebar:
  order: 8
---

تطبيقات الويب هي هدف رئيسي للمهاجمين. يحتاج تطبيق Gin الذي يعالج مدخلات المستخدم أو يخزن البيانات أو يعمل خلف وكيل عكسي إلى تكوين أمني متعمد قبل دخوله بيئة الإنتاج. يغطي هذا الدليل أهم الدفاعات ويوضح كيفية تطبيق كل واحد منها مع وسيطات Gin ومكتبات Go القياسية.

:::note
الأمان متعدد الطبقات. لا تقنية واحدة في هذه القائمة كافية بمفردها. طبّق جميع الأقسام ذات الصلة لبناء دفاع متعدد الطبقات.
:::

## تكوين CORS

يتحكم مشاركة الموارد عبر المصادر (CORS) في النطاقات الخارجية التي يمكنها إرسال طلبات إلى واجهتك البرمجية. يمكن أن يسمح CORS المُكوّن بشكل خاطئ لمواقع خبيثة بقراءة استجابات خادمك نيابة عن المستخدمين المُصادق عليهم.

استخدم حزمة [`gin-contrib/cors`](https://github.com/gin-contrib/cors) للحصول على حل مُختبر جيداً.

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
لا تستخدم أبداً `AllowOrigins: []string{"*"}` مع `AllowCredentials: true`. هذا يُخبر المتصفحات أن أي موقع يمكنه إرسال طلبات مُصادق عليها إلى واجهتك البرمجية.
:::

## حماية CSRF

يخدع تزوير الطلب عبر المواقع (CSRF) متصفح المستخدم المُصادق عليه لإرسال طلبات غير مرغوبة إلى تطبيقك. أي نقطة نهاية تغيّر الحالة (POST، PUT، DELETE) وتعتمد على ملفات تعريف الارتباط للمصادقة تحتاج حماية CSRF.

استخدم وسيط [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) لإضافة حماية قائمة على الرموز.

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
حماية CSRF ضرورية للتطبيقات التي تستخدم مصادقة قائمة على ملفات تعريف الارتباط. الواجهات البرمجية التي تعتمد فقط على ترويسات `Authorization` (مثل رموز Bearer) ليست عرضة لـ CSRF لأن المتصفحات لا ترفق تلك الترويسات تلقائياً.
:::

## تحديد المعدل

يمنع تحديد المعدل الإساءة وهجمات القوة الغاشمة واستنفاد الموارد. يمكنك استخدام حزمة المكتبة القياسية `golang.org/x/time/rate` لبناء محدد معدل بسيط لكل عميل كوسيط.

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
المثال أعلاه يخزن محددات المعدل في خريطة في الذاكرة. في بيئة الإنتاج، يجب إضافة تنظيف دوري للإدخالات القديمة والنظر في محدد معدل موزع (مثل مدعوم بـ Redis) إذا كنت تشغل عدة نسخ من التطبيق.
:::

## التحقق من المدخلات ومنع حقن SQL

تحقق دائماً من المدخلات واربطها باستخدام ربط النماذج في Gin مع علامات الهياكل. لا تبنِ أبداً استعلامات SQL بتسلسل مدخلات المستخدم.

### التحقق من المدخلات بعلامات الهياكل

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

### استخدام الاستعلامات المُعلمة

```go
// DANGEROUS -- SQL injection vulnerability
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// SAFE -- parameterized query
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

ينطبق هذا على كل مكتبة قاعدة بيانات. سواء استخدمت `database/sql` أو GORM أو sqlx أو ORM آخر، استخدم دائماً عناصر نائبة للمعاملات ولا تستخدم تسلسل السلاسل أبداً.

:::note
التحقق من المدخلات والاستعلامات المُعلمة هما أهم دفاعاتك ضد هجمات الحقن. لا أحدهما كافٍ وحده -- استخدم كليهما.
:::

## منع XSS

تحدث البرمجة عبر المواقع (XSS) عندما يحقن مهاجم نصوصاً ضارة تُنفذ في متصفحات المستخدمين الآخرين. دافع عن هذا على طبقات متعددة.

### ترميز مخرجات HTML

عند عرض قوالب HTML، تُرمّز حزمة `html/template` في Go المخرجات افتراضياً. إذا أعدت بيانات من المستخدم كـ JSON، تأكد من تعيين ترويسة `Content-Type` بشكل صحيح حتى لا تفسرها المتصفحات كـ HTML.

```go
// Gin sets Content-Type automatically for JSON responses.
// Use c.JSON, not c.String, when returning structured data.
c.JSON(200, gin.H{"input": userInput})
```

### استخدام SecureJSON لحماية JSONP

يوفر Gin `c.SecureJSON` الذي يُضيف `while(1);` لمنع اختطاف JSON.

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### تعيين Content-Type صراحة عند الحاجة

```go
// For API endpoints, always return JSON
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

ترويسة `X-Content-Type-Options: nosniff` تمنع المتصفحات من تخمين نوع MIME، مما يمنعها من تفسير الاستجابة كـ HTML عندما يُعلنها الخادم كشيء آخر.

## وسيط ترويسات الأمان

إضافة ترويسات الأمان هي إحدى أبسط وأكثر خطوات التقوية فعالية. راجع صفحة [ترويسات الأمان](/ar/docs/middleware/security-headers/) الكاملة للحصول على مثال مفصل. فيما يلي ملخص سريع للترويسات الأساسية.

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

| الترويسة | ما تمنعه |
|--------|-----------------|
| `X-Frame-Options: DENY` | الاختراق بالنقر عبر iframes |
| `X-Content-Type-Options: nosniff` | هجمات تخمين نوع MIME |
| `Strict-Transport-Security` | تخفيض البروتوكول واختطاف ملفات تعريف الارتباط |
| `Content-Security-Policy` | XSS وحقن البيانات |
| `Referrer-Policy` | تسريب معاملات URL الحساسة لأطراف ثالثة |
| `Permissions-Policy` | الاستخدام غير المُصرّح به لواجهات المتصفح (الكاميرا، الميكروفون، إلخ) |

## الوكلاء الموثوقون

عندما يعمل تطبيقك خلف وكيل عكسي أو موازن حمل، يجب إخبار Gin بالوكلاء التي يجب الوثوق بها. بدون هذا التكوين، يمكن للمهاجمين تزوير ترويسة `X-Forwarded-For` لتجاوز ضوابط الوصول وتحديد المعدل المبنية على IP.

```go
// Trust only your known proxy addresses
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

راجع صفحة [الوكلاء الموثوقون](/ar/docs/server-config/trusted-proxies/) للحصول على شرح كامل وخيارات التكوين.

## HTTPS و TLS

يجب على جميع تطبيقات Gin في بيئة الإنتاج تقديم حركة المرور عبر HTTPS. يدعم Gin شهادات TLS التلقائية عبر Let's Encrypt.

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... routes ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

راجع صفحة [دعم Let's Encrypt](/ar/docs/server-config/support-lets-encrypt/) للحصول على تعليمات الإعداد الكاملة بما في ذلك مديري الشهادات المخصصين.

:::note
ادمج دائماً HTTPS مع ترويسة `Strict-Transport-Security` (HSTS) لمنع هجمات تخفيض البروتوكول. بمجرد تعيين ترويسة HSTS، سترفض المتصفحات الاتصال عبر HTTP العادي.
:::

## انظر أيضاً

- [ترويسات الأمان](/ar/docs/middleware/security-headers/)
- [الوكلاء الموثوقون](/ar/docs/server-config/trusted-proxies/)
- [دعم Let's Encrypt](/ar/docs/server-config/support-lets-encrypt/)
- [وسيطات مخصصة](/ar/docs/middleware/custom-middleware/)
- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
