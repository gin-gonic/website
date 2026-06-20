---
title: "تعریف فرمت لاگ مسیرها"
sidebar:
  order: 6
---

وقتی Gin شروع به کار می‌کند، تمام مسیرهای ثبت‌شده را در حالت debug چاپ می‌کند. فرمت پیش‌فرض به این شکل است:

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

می‌توانید این فرمت را با اختصاص یک تابع به `gin.DebugPrintRouteFunc` سفارشی کنید. این زمانی مفید است که بخواهید مسیرها را به‌صورت JSON، جفت‌های کلید-مقدار، یا هر فرمت دیگری که خط لوله لاگ شما انتظار دارد ثبت کنید.

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

وقتی سرور شروع به کار می‌کند، به‌جای خطوط پیش‌فرض `[GIN-debug]`، خواهید دید:

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## همچنین ببینید

- [فرمت لاگ سفارشی](/fa/docs/logging/custom-log-format/)
- [رد شدن از لاگ‌گذاری](/fa/docs/logging/skip-logging/)
