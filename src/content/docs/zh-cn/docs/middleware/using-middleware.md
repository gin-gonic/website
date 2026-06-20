---
title: "使用中间件"
sidebar:
  order: 2
---

Gin 中的中间件是在路由处理函数之前（以及可选地之后）运行的函数。它们用于日志记录、认证、错误恢复和请求修改等横切关注点。

Gin 支持三个级别的中间件附加：

- **全局中间件** — 应用于路由器中的每个路由。使用 `router.Use()` 注册。适用于日志记录和 panic 恢复等普遍适用的关注点。
- **分组中间件** — 应用于路由组中的所有路由。使用 `group.Use()` 注册。适用于将认证或授权应用到路由子集（例如所有 `/admin/*` 路由）。
- **路由级中间件** — 仅应用于单个路由。作为额外参数传递给 `router.GET()`、`router.POST()` 等。适用于路由特定的逻辑，如自定义限流或输入验证。

**执行顺序：** 中间件函数按注册顺序执行。当中间件调用 `c.Next()` 时，它将控制权传递给下一个中间件（或最终处理函数），然后在 `c.Next()` 返回后继续执行。这创建了一个类似栈的（LIFO）模式——第一个注册的中间件最先开始但最后结束。如果中间件不调用 `c.Next()`，后续的中间件和处理函数将被跳过（这对于使用 `c.Abort()` 短路请求很有用）。

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  router := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  router.Use(gin.Recovery())

  // Per route middleware, you can add as many as you desire.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Authorization group
  // authorized := router.Group("/", AuthRequired())
  // exactly the same as:
  authorized := router.Group("/")
  // per group middleware! in this case we use the custom created
  // AuthRequired() middleware just in the "authorized" group.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // nested group
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
`gin.Default()` 是一个便捷函数，它创建一个已附加 `Logger` 和 `Recovery` 中间件的路由器。如果你想要一个不带中间件的空白路由器，请如上所示使用 `gin.New()`，然后只添加你需要的中间件。
:::
