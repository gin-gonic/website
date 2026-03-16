---
title: "Define format for the log of routes"
sidebar:
  order: 6
---

When Gin starts, it prints all registered routes in debug mode. The default format looks like this:

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

You can customize this format by assigning a function to `gin.DebugPrintRouteFunc`. This is useful if you want to log routes as JSON, key-value pairs, or in any other format your logging pipeline expects.

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

When the server starts, instead of the default `[GIN-debug]` lines, you will see:

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## See also

- [Custom log format](/en/docs/logging/custom-log-format/)
- [Skip logging](/en/docs/logging/skip-logging/)
