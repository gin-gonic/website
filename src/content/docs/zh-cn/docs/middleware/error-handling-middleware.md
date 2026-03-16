---
title: "错误处理中间件"
sidebar:
  order: 4
---

在典型的 RESTful 应用中，你可能会在任何路由中遇到错误——无效输入、数据库故障、未授权访问或内部 bug。在每个处理函数中单独处理错误会导致重复代码和不一致的响应。

集中式的错误处理中间件通过在每个请求后运行并检查通过 `c.Error(err)` 添加到 Gin 上下文中的任何错误来解决这个问题。如果发现错误，它会发送一个带有正确状态码的结构化 JSON 响应。

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## 测试

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
你可以扩展此模式，将特定的错误类型映射到不同的 HTTP 状态码，或者在响应之前将错误记录到外部服务。
:::

## 另请参阅

- [自定义中间件](/zh-cn/docs/middleware/custom-middleware/)
- [使用中间件](/zh-cn/docs/middleware/using-middleware/)
