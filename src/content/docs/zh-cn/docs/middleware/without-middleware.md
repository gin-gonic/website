---
title: "默认不使用中间件"
sidebar:
  order: 1
---

Gin 提供了两种创建路由引擎的方式，区别在于默认附加了哪些中间件。

### `gin.Default()` -- 带有 Logger 和 Recovery

`gin.Default()` 创建一个已附加两个中间件的路由器：

- **Logger** -- 将请求日志写入标准输出（方法、路径、状态码、延迟）。
- **Recovery** -- 从处理函数中的任何 panic 恢复并返回 500 响应，防止服务器崩溃。

这是快速入门最常用的选择。

### `gin.New()` -- 一个空白引擎

`gin.New()` 创建一个完全空白的路由器，**不附加任何中间件**。当你想完全控制运行哪些中间件时很有用，例如：

- 你想使用结构化日志记录器（如 `slog` 或 `zerolog`）代替默认的文本日志记录器。
- 你想自定义 panic 恢复行为。
- 你正在构建一个需要最小化或专用中间件栈的微服务。

### 示例

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a blank engine with no middleware.
  r := gin.New()

  // Attach only the middleware you need.
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  log.Fatal(r.Run(":8080"))
}
```

在上面的示例中，包含了 Recovery 中间件以防止崩溃，但省略了默认的 Logger 中间件。你可以用自己的日志中间件替换它，或者完全不使用。
