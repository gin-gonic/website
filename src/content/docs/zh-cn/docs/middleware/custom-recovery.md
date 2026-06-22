---
title: "自定义 Recovery 行为"
sidebar:
  order: 4
---

Gin 内置的 `gin.Recovery()` 中间件会捕获处理请求过程中发生的任何 panic，写入 `500` 响应，并保持服务器继续运行。当你需要控制恢复时的行为时——例如向用户报告 panic、将其保存到数据库，或发送到错误追踪服务——请改用 `gin.CustomRecovery()`。

`gin.CustomRecovery()` 接受一个签名为 `func(c *gin.Context, recovered any)` 的处理函数。`recovered` 值就是传递给 `panic()` 的任何内容。在处理函数内部，你决定如何响应，然后调用 `c.AbortWithStatus()`（或其他 abort 方法），以便跳过剩余的处理函数。

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  r := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  r.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  r.Use(gin.CustomRecovery(func(c *gin.Context, recovered any) {
    if err, ok := recovered.(string); ok {
      c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
    }
    c.AbortWithStatus(http.StatusInternalServerError)
  }))

  r.GET("/panic", func(c *gin.Context) {
    // panic with a string -- the custom middleware could save this to a database or report it to the user
    panic("foo")
  })

  r.GET("/", func(c *gin.Context) {
    c.String(http.StatusOK, "ohai")
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

## 测试

```bash
# Triggers the panic; the custom recovery handler returns the message
curl http://localhost:8080/panic
# => error: foo

# A normal request still works
curl http://localhost:8080/
# => ohai
```

## 另请参阅

- [自定义中间件](/zh-cn/docs/middleware/custom-middleware/)
- [默认不带中间件的空白 Gin](/zh-cn/docs/middleware/without-middleware/)
- [错误处理中间件](/zh-cn/docs/middleware/error-handling-middleware/)
