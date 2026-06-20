---
title: "تجنب تسجيل سلاسل الاستعلام"
sidebar:
  order: 5
---

غالباً ما تحتوي سلاسل الاستعلام على معلومات حساسة مثل رموز API وكلمات المرور ومعرّفات الجلسات أو معلومات التعريف الشخصية (PII). يمكن أن يخلق تسجيل هذه القيم مخاطر أمنية وقد ينتهك لوائح الخصوصية مثل GDPR أو HIPAA. بإزالة سلاسل الاستعلام من سجلاتك، تقلل من فرصة تسريب البيانات الحساسة عبر ملفات السجل أو أنظمة المراقبة أو أدوات الإبلاغ عن الأخطاء.

استخدم خيار `SkipQueryString` في `LoggerConfig` لمنع ظهور سلاسل الاستعلام في السجلات. عند التفعيل، سيُسجل طلب إلى `/path?token=secret&user=alice` ببساطة كـ `/path`.

```go
func main() {
  router := gin.New()

  // SkipQueryString indicates that the logger should not log the query string.
  // For example, /path?q=1 will be logged as /path
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

يمكنك اختبار الفرق باستخدام `curl`:

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

بدون `SkipQueryString`، يتضمن إدخال السجل سلسلة الاستعلام الكاملة:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

مع `SkipQueryString: true`، تُزال سلسلة الاستعلام:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

هذا مفيد بشكل خاص في البيئات الحساسة للامتثال حيث يتم إعادة توجيه مخرجات السجل إلى خدمات طرف ثالث أو تخزينها لفترة طويلة. لا يزال تطبيقك يملك وصولاً كاملاً لمعاملات الاستعلام عبر `c.Query()` -- فقط مخرجات السجل هي المتأثرة.
