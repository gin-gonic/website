---
title: "استخدام الوسيطات"
sidebar:
  order: 2
---

الوسيطات في Gin هي دوال تُنفذ قبل (واختيارياً بعد) معالج المسار. تُستخدم للمهام المشتركة مثل التسجيل والمصادقة واسترداد الأخطاء وتعديل الطلبات.

يدعم Gin ثلاثة مستويات لإرفاق الوسيطات:

- **الوسيطات العالمية** -- تُطبق على كل مسار في الموجّه. تُسجل باستخدام `router.Use()`. مناسبة للمهام مثل التسجيل واسترداد الذعر التي تُطبق عالمياً.
- **وسيطات المجموعة** -- تُطبق على جميع المسارات داخل مجموعة مسارات. تُسجل باستخدام `group.Use()`. مفيدة لتطبيق المصادقة أو التفويض على مجموعة فرعية من المسارات (مثل جميع مسارات `/admin/*`).
- **وسيطات لكل مسار** -- تُطبق على مسار واحد فقط. تُمرر كوسيطات إضافية إلى `router.GET()` و`router.POST()` وغيرها. مفيدة للمنطق الخاص بمسار معين مثل تحديد المعدل المخصص أو التحقق من المدخلات.

**ترتيب التنفيذ:** تُنفذ دوال الوسيطات بالترتيب الذي سُجلت به. عندما يستدعي وسيط `c.Next()`، يمرر التحكم إلى الوسيط التالي (أو المعالج النهائي)، ثم يستأنف التنفيذ بعد إرجاع `c.Next()`. هذا ينشئ نمطاً يشبه المكدس (LIFO) -- أول وسيط مُسجل هو أول من يبدأ لكن آخر من ينتهي. إذا لم يستدعِ وسيط `c.Next()`، يتم تخطي الوسيطات والمعالج التالية (مفيد للاختصار مع `c.Abort()`).

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  router := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  router.Use(gin.Recovery())

  // Per route middleware, you can add as many as you desire.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Authorization group
  // authorized := router.Group("/", AuthRequired())
  // exactly the same as:
  authorized := router.Group("/")
  // per group middleware! in this case we use the custom created
  // AuthRequired() middleware just in the "authorized" group.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // nested group
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
`gin.Default()` هي دالة مريحة تُنشئ موجّهاً مع وسيطات `Logger` و`Recovery` مُرفقة بالفعل. إذا أردت موجّهاً فارغاً بدون وسيطات، استخدم `gin.New()` كما هو موضح أعلاه وأضف فقط الوسيطات التي تحتاجها.
:::
