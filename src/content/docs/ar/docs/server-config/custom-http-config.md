---
title: "تكوين HTTP مخصص"
sidebar:
  order: 1
---

بشكل افتراضي، `router.Run()` يبدأ خادم HTTP أساسي. للاستخدام في الإنتاج، قد تحتاج لتخصيص المهلات الزمنية أو حدود الترويسات أو إعدادات TLS. يمكنك القيام بذلك بإنشاء `http.Server` خاص بك وتمرير موجّه Gin كـ `Handler`.

## الاستخدام الأساسي

مرر موجّه Gin مباشرة إلى `http.ListenAndServe`:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  http.ListenAndServe(":8080", router)
}
```

## مع إعدادات خادم مخصصة

أنشئ هيكل `http.Server` لتكوين مهلات القراءة/الكتابة وخيارات أخرى:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

## اختبره

```sh
curl http://localhost:8080/ping
# Output: pong
```

## انظر أيضاً

- [إعادة التشغيل أو الإيقاف بأمان](/ar/docs/server-config/graceful-restart-or-stop/)
- [تشغيل خدمات متعددة](/ar/docs/server-config/run-multiple-service/)
