---
title: "تعریف فرمت لاگ مسیرها"
sidebar:
  order: 6
---

لاگ پیش‌فرض مسیرها به این شکل است:
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

اگر می‌خواهید این اطلاعات را در فرمت مشخصی لاگ کنید (مثلاً JSON، جفت کلید-مقدار یا چیز دیگری)، می‌توانید این فرمت را با `gin.DebugPrintRouteFunc` تعریف کنید.
در مثال زیر، تمام مسیرها را با پکیج log استاندارد لاگ می‌کنیم اما می‌توانید از ابزار لاگ دیگری که متناسب با نیازهای شماست استفاده کنید.
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
