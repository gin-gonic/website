---
title: "中间件"
sidebar:
  order: 6
---

Gin 中的中间件提供了一种在 HTTP 请求到达路由处理函数之前对其进行处理的方式。中间件函数与路由处理函数具有相同的签名——`gin.HandlerFunc`——通常调用 `c.Next()` 将控制权传递给链中的下一个处理函数。

## 中间件的工作原理

Gin 使用**洋葱模型**来执行中间件。每个中间件分两个阶段运行：

1. **处理前** -- `c.Next()` 之前的代码在路由处理函数之前运行。
2. **处理后** -- `c.Next()` 之后的代码在路由处理函数返回后运行。

这意味着中间件像洋葱的层一样包裹着处理函数。第一个附加的中间件是最外层。

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // Pre-handler phase
    c.Next()

    // Post-handler phase
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## 附加中间件

在 Gin 中有三种附加中间件的方式：

```go
// 1. Global -- applies to all routes
router := gin.New()
router.Use(Logger(), Recovery())

// 2. Group -- applies to all routes in the group
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. Per-route -- applies to a single route
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

在更广泛范围附加的中间件先执行。在上面的例子中，对 `GET /v1/users` 的请求会依次执行 `Logger`、`Recovery`、`AuthRequired`，最后是 `listUsers`。

## 本节内容

- [**使用中间件**](./using-middleware/) -- 全局、分组或单个路由附加中间件
- [**自定义中间件**](./custom-middleware/) -- 编写自己的中间件函数
- [**使用 BasicAuth 中间件**](./using-basicauth/) -- HTTP 基本认证
- [**中间件中的 Goroutine**](./goroutines-inside-middleware/) -- 从中间件安全地运行后台任务
- [**自定义 HTTP 配置**](./custom-http-config/) -- 中间件中的错误处理和恢复
- [**安全头**](./security-headers/) -- 设置常见的安全头
