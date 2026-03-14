---
title: "结构化日志"
sidebar:
  order: 7
---

结构化日志生成机器可读的日志输出（通常是 JSON），而不是纯文本。这使得在 ELK Stack、Datadog 或 Grafana Loki 等日志聚合系统中搜索、过滤和分析日志更加容易。

## 为什么使用结构化日志？

Gin 的默认日志记录器输出人类可读的文本，这在开发时很好，但在大规模场景下难以解析。结构化日志为你提供：

- **可查询的字段** — 按状态码、延迟或用户 ID 过滤日志
- **一致的格式** — 每条日志记录具有相同的结构
- **关联性** — 使用请求 ID 跨服务追踪请求

## 使用 slog（Go 1.21+）

Go 的标准库包含用于结构化日志的 `log/slog`。以下是如何与 Gin 一起使用：

```go
package main

import (
  "log/slog"
  "os"
  "time"

  "github.com/gin-gonic/gin"
)

func SlogMiddleware(logger *slog.Logger) gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()
    path := c.Request.URL.Path
    query := c.Request.URL.RawQuery

    c.Next()

    logger.Info("request",
      slog.String("method", c.Request.Method),
      slog.String("path", path),
      slog.String("query", query),
      slog.Int("status", c.Writer.Status()),
      slog.Duration("latency", time.Since(start)),
      slog.String("client_ip", c.ClientIP()),
      slog.Int("body_size", c.Writer.Size()),
    )

    if len(c.Errors) > 0 {
      for _, err := range c.Errors {
        logger.Error("request error", slog.String("error", err.Error()))
      }
    }
  }
}

func main() {
  logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

  r := gin.New()
  r.Use(SlogMiddleware(logger))
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run(":8080")
}
```

这会生成如下日志记录：

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## 请求 ID / 关联 ID

为每条日志记录添加唯一的请求 ID，有助于跨服务追踪请求：

```go
package main

import (
  "log/slog"
  "os"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/google/uuid"
)

func RequestIDMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    requestID := c.GetHeader("X-Request-ID")
    if requestID == "" {
      requestID = uuid.New().String()
    }
    c.Set("request_id", requestID)
    c.Header("X-Request-ID", requestID)
    c.Next()
  }
}

func SlogMiddleware(logger *slog.Logger) gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    c.Next()

    requestID, _ := c.Get("request_id")
    logger.Info("request",
      slog.String("request_id", requestID.(string)),
      slog.String("method", c.Request.Method),
      slog.String("path", c.Request.URL.Path),
      slog.Int("status", c.Writer.Status()),
      slog.Duration("latency", time.Since(start)),
    )
  }
}

func main() {
  logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

  r := gin.New()
  r.Use(RequestIDMiddleware())
  r.Use(SlogMiddleware(logger))
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run(":8080")
}
```

## 使用 zerolog

[zerolog](https://github.com/rs/zerolog) 是一个流行的零分配 JSON 日志库：

```go
package main

import (
  "os"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/rs/zerolog"
  "github.com/rs/zerolog/log"
)

func ZerologMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    c.Next()

    log.Info().
      Str("method", c.Request.Method).
      Str("path", c.Request.URL.Path).
      Int("status", c.Writer.Status()).
      Dur("latency", time.Since(start)).
      Str("client_ip", c.ClientIP()).
      Msg("request")
  }
}

func main() {
  zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

  // Pretty logging for development
  if gin.Mode() == gin.DebugMode {
    log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
  }

  r := gin.New()
  r.Use(ZerologMiddleware())
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run(":8080")
}
```

## 最佳实践

- **在生产环境使用 JSON 格式** — 开发时使用人类可读格式，生产环境使用 JSON 进行日志聚合
- **包含请求 ID** — 在服务边界之间传播 `X-Request-ID` 头用于分布式追踪
- **使用适当的日志级别** — 正常请求使用 `Info`，4xx 使用 `Warn`，5xx 使用 `Error`
- **避免记录敏感数据** — 从日志输出中排除密码、令牌和 PII
- **设置 `GIN_MODE=release`** — 这会在生产环境中禁用 Gin 的默认调试日志

## 另请参阅

- [如何写入日志文件](/zh-cn/docs/logging/write-log/)
- [避免记录查询字符串](/zh-cn/docs/logging/avoid-logging-query-strings/)
- [自定义日志格式](/zh-cn/docs/logging/custom-log-format/)
