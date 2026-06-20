---
title: "الوسيطات"
sidebar:
  order: 6
---

توفر الوسيطات في Gin طريقة لمعالجة طلبات HTTP قبل وصولها إلى معالجات المسارات. دالة الوسيط لها نفس توقيع معالج المسار -- `gin.HandlerFunc` -- وعادةً تستدعي `c.Next()` لتمرير التحكم إلى المعالج التالي في السلسلة.

## كيف تعمل الوسيطات

يستخدم Gin **نموذج البصلة** لتنفيذ الوسيطات. كل وسيط يعمل في مرحلتين:

1. **قبل المعالج** -- الكود قبل `c.Next()` يُنفذ قبل معالج المسار.
2. **بعد المعالج** -- الكود بعد `c.Next()` يُنفذ بعد إرجاع معالج المسار.

هذا يعني أن الوسيطات تلف المعالج مثل طبقات البصلة. أول وسيط مُرفق هو الطبقة الخارجية.

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // Pre-handler phase
    c.Next()

    // Post-handler phase
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## إرفاق الوسيطات

هناك ثلاث طرق لإرفاق الوسيطات في Gin:

```go
// 1. Global -- applies to all routes
router := gin.New()
router.Use(Logger(), Recovery())

// 2. Group -- applies to all routes in the group
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. Per-route -- applies to a single route
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

الوسيطات المُرفقة في نطاق أوسع تُنفذ أولاً. في المثال أعلاه، طلب إلى `GET /v1/users` سينفذ `Logger` ثم `Recovery` ثم `AuthRequired` ثم `listUsers`.

## في هذا القسم

- [**استخدام الوسيطات**](./using-middleware/) -- إرفاق الوسيطات عالمياً أو لمجموعات أو مسارات فردية
- [**وسيطات مخصصة**](./custom-middleware/) -- كتابة دوال الوسيطات الخاصة بك
- [**استخدام وسيط BasicAuth**](./using-basicauth/) -- المصادقة الأساسية عبر HTTP
- [**Goroutines داخل الوسيطات**](./goroutines-inside-middleware/) -- تشغيل المهام الخلفية بأمان من الوسيطات
- [**تكوين HTTP مخصص**](./custom-http-config/) -- معالجة الأخطاء والاسترداد في الوسيطات
- [**ترويسات الأمان**](./security-headers/) -- تعيين ترويسات الأمان الشائعة
