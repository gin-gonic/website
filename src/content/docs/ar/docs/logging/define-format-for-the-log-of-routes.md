---
title: "تحديد تنسيق سجل المسارات"
sidebar:
  order: 6
---

عندما يبدأ Gin، يطبع جميع المسارات المسجلة في وضع التصحيح. التنسيق الافتراضي يبدو هكذا:

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

يمكنك تخصيص هذا التنسيق بتعيين دالة إلى `gin.DebugPrintRouteFunc`. هذا مفيد إذا أردت تسجيل المسارات بتنسيق JSON أو أزواج المفتاح-القيمة أو أي تنسيق آخر يتوقعه نظام التسجيل لديك.

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
    log.Printf("endpoint %v %v %v %v\n", httpMethod, absolutePath, handlerName, nuHandlers)
  }

  router.POST("/foo", func(c *gin.Context) {
    c.JSON(http.StatusOK, "foo")
  })

  router.GET("/bar", func(c *gin.Context) {
    c.JSON(http.StatusOK, "bar")
  })

  router.GET("/status", func(c *gin.Context) {
    c.JSON(http.StatusOK, "ok")
  })

  router.Run(":8080")
}
```

عند بدء تشغيل الخادم، بدلاً من سطور `[GIN-debug]` الافتراضية، سترى:

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## انظر أيضاً

- [تنسيق السجل المخصص](/ar/docs/logging/custom-log-format/)
- [تخطي التسجيل](/ar/docs/logging/skip-logging/)
