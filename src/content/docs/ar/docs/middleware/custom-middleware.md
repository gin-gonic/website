---
title: "وسيطات مخصصة"
sidebar:
  order: 3
---

وسيط Gin هو دالة تُرجع `gin.HandlerFunc`. يعمل الوسيط قبل و/أو بعد المعالج الرئيسي، مما يجعله مفيداً للتسجيل والمصادقة ومعالجة الأخطاء والمهام المشتركة الأخرى.

### تدفق تنفيذ الوسيط

دالة الوسيط لها مرحلتان، مقسومتان باستدعاء `c.Next()`:

- **قبل `c.Next()`** -- الكود هنا يُنفذ قبل وصول الطلب إلى المعالج الرئيسي. استخدم هذه المرحلة لمهام الإعداد مثل تسجيل وقت البدء أو التحقق من الرموز أو تعيين قيم السياق باستخدام `c.Set()`.
- **`c.Next()`** -- يستدعي المعالج التالي في السلسلة (قد يكون وسيطاً آخر أو معالج المسار النهائي). يتوقف التنفيذ هنا حتى تكتمل جميع المعالجات اللاحقة.
- **بعد `c.Next()`** -- الكود هنا يُنفذ بعد انتهاء المعالج الرئيسي. استخدم هذه المرحلة للتنظيف أو تسجيل حالة الاستجابة أو قياس التأخير.

إذا أردت إيقاف السلسلة بالكامل (مثلاً عند فشل المصادقة)، استدعِ `c.Abort()` بدلاً من `c.Next()`. هذا يمنع تنفيذ أي معالجات متبقية. يمكنك دمجه مع استجابة، مثلاً `c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    t := time.Now()

    // Set example variable
    c.Set("example", "12345")

    // before request

    c.Next()

    // after request
    latency := time.Since(t)
    log.Print(latency)

    // access the status we are sending
    status := c.Writer.Status()
    log.Println(status)
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())

  r.GET("/test", func(c *gin.Context) {
    example := c.MustGet("example").(string)

    // it would print: "12345"
    log.Println(example)
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

### جرّبها

```bash
curl http://localhost:8080/test
```

ستظهر سجلات الخادم تأخير الطلب ورمز حالة HTTP لكل طلب يمر عبر وسيط `Logger`.

## انظر أيضاً

- [وسيط معالجة الأخطاء](/ar/docs/middleware/error-handling-middleware/)
- [استخدام الوسيطات](/ar/docs/middleware/using-middleware/)
