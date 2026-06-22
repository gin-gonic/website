---
title: "سلوك الاستعادة المخصص"
sidebar:
  order: 4
---

يلتقط وسيط `gin.Recovery()` المدمج في Gin أي حالة هلع (panic) تحدث أثناء معالجة طلب، ويكتب استجابة `500`، ويبقي الخادم قيد التشغيل. عندما تحتاج إلى التحكم فيما يحدث عند الاستعادة -- على سبيل المثال للإبلاغ عن الهلع للمستخدم، أو حفظه في قاعدة بيانات، أو إرساله إلى خدمة تتبع الأخطاء -- استخدم `gin.CustomRecovery()` بدلاً من ذلك.

تأخذ `gin.CustomRecovery()` معالجاً بالتوقيع `func(c *gin.Context, recovered any)`. القيمة `recovered` هي أياً كان ما مُرّر إلى `panic()`. داخل المعالج تقرر كيفية الاستجابة، ثم تستدعي `c.AbortWithStatus()` (أو طريقة إيقاف أخرى) حتى يتم تخطي المعالجات المتبقية.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  r := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  r.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  r.Use(gin.CustomRecovery(func(c *gin.Context, recovered any) {
    if err, ok := recovered.(string); ok {
      c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
    }
    c.AbortWithStatus(http.StatusInternalServerError)
  }))

  r.GET("/panic", func(c *gin.Context) {
    // panic with a string -- the custom middleware could save this to a database or report it to the user
    panic("foo")
  })

  r.GET("/", func(c *gin.Context) {
    c.String(http.StatusOK, "ohai")
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

## جرّبها

```bash
# Triggers the panic; the custom recovery handler returns the message
curl http://localhost:8080/panic
# => error: foo

# A normal request still works
curl http://localhost:8080/
# => ohai
```

## انظر أيضاً

- [وسيط مخصص](/ar/docs/middleware/custom-middleware/)
- [Gin فارغ بدون وسيطات افتراضياً](/ar/docs/middleware/without-middleware/)
- [وسيط معالجة الأخطاء](/ar/docs/middleware/error-handling-middleware/)
