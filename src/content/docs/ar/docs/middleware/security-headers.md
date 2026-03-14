---
title: "ترويسات الأمان"
sidebar:
  order: 7
---

من المهم استخدام ترويسات الأمان لحماية تطبيق الويب من الثغرات الأمنية الشائعة. يوضح هذا المثال كيفية إضافة ترويسات أمان إلى تطبيق Gin وأيضاً كيفية تجنب هجمات حقن ترويسة المضيف (SSRF، إعادة التوجيه المفتوح).

### ما تحمي منه كل ترويسة

| الترويسة | الغرض |
|--------|---------|
| `X-Content-Type-Options: nosniff` | تمنع هجمات تخمين نوع MIME. بدون هذه الترويسة، قد تفسر المتصفحات الملفات كنوع محتوى مختلف عن المُعلن، مما يسمح للمهاجمين بتنفيذ نصوص ضارة متخفية كأنواع ملفات غير ضارة. |
| `X-Frame-Options: DENY` | تمنع الاختراق بالنقر (clickjacking) عن طريق تعطيل تحميل الصفحة داخل `<iframe>`. |
| `Content-Security-Policy` | تتحكم في الموارد (النصوص، الأنماط، الصور، الخطوط، إلخ) التي يُسمح للمتصفح بتحميلها ومن أي مصادر. هذا أحد أكثر الدفاعات فعالية ضد XSS. |
| `X-XSS-Protection: 1; mode=block` | تُفعّل مرشح XSS المدمج في المتصفح. هذه الترويسة مُهملة إلى حد كبير في المتصفحات الحديثة، لكنها توفر دفاعاً إضافياً. |
| `Strict-Transport-Security` | تُجبر المتصفح على استخدام HTTPS لجميع الطلبات المستقبلية للنطاق. تمنع هجمات تخفيض البروتوكول واختطاف ملفات تعريف الارتباط. |
| `Referrer-Policy: strict-origin` | تتحكم في مقدار معلومات المُحيل المُرسلة مع الطلبات الصادرة. |
| `Permissions-Policy` | تُقيّد ميزات المتصفح (الموقع الجغرافي، الكاميرا، الميكروفون، إلخ) التي يمكن للصفحة استخدامها. |

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

يمكنك اختبارها عبر `curl`:

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

اختيارياً، استخدم [gin helmet](https://github.com/danielkov/gin-helmet) `go get github.com/danielkov/gin-helmet/ginhelmet`

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
