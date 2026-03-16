---
title: "定义路由日志格式"
sidebar:
  order: 6
---

当 Gin 启动时，它会在调试模式下打印所有注册的路由。默认格式如下：

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

你可以通过为 `gin.DebugPrintRouteFunc` 赋值一个函数来自定义此格式。当你希望将路由记录为 JSON、键值对或日志管道所期望的任何其他格式时，这将非常有用。

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

当服务器启动时，你将看到以下输出来代替默认的 `[GIN-debug]` 行：

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## 另请参阅

- [自定义日志格式](/zh-cn/docs/logging/custom-log-format/)
- [跳过日志记录](/zh-cn/docs/logging/skip-logging/)
