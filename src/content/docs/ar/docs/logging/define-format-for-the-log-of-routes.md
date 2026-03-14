---
title: "تحديد تنسيق سجل المسارات"
sidebar:
  order: 6
---

السجل الافتراضي للمسارات هو:
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

إذا أردت تسجيل هذه المعلومات بتنسيق معين (مثل JSON أو أزواج المفتاح-القيمة أو شيء آخر)، يمكنك تحديد هذا التنسيق باستخدام `gin.DebugPrintRouteFunc`.
في المثال أدناه، نسجّل جميع المسارات بحزمة log القياسية لكن يمكنك استخدام أداة تسجيل أخرى تناسب احتياجاتك.
```go
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

  // Listen and Server in http://0.0.0.0:8080
  router.Run()
}
```
