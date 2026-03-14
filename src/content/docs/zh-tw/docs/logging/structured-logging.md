---
title: "結構化日誌記錄"
sidebar:
  order: 7
---

結構化日誌記錄產生機器可讀的日誌輸出（通常是 JSON），而不是純文字。這使得在日誌聚合系統中（如 ELK Stack、Datadog 或 Grafana Loki）更容易搜尋、過濾和分析日誌。

## 為什麼使用結構化日誌記錄？

Gin 的預設日誌記錄器輸出人類可讀的文字，這在開發時很好但在大規模時難以解析。結構化日誌記錄提供：

- **可查詢的欄位** — 按狀態碼、延遲時間或使用者 ID 過濾日誌
- **一致的格式** — 每個日誌條目具有相同的結構
- **關聯性** — 使用請求 ID 跨服務追蹤請求

## 使用 slog（Go 1.21+）

Go 的標準函式庫包含用於結構化日誌記錄的 `log/slog`。以下是如何在 Gin 中使用它：

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

產生如下日誌條目：

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## 請求 ID / 關聯 ID

為每個日誌條目新增唯一的請求 ID 有助於跨服務追蹤請求：

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

[zerolog](https://github.com/rs/zerolog) 是一個流行的零記憶體配置 JSON 日誌記錄器：

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

## 最佳實務

- **在正式環境使用 JSON 格式** — 開發時使用人類可讀格式，正式環境使用 JSON 以便日誌聚合
- **包含請求 ID** — 跨服務邊界傳播 `X-Request-ID` 標頭以進行分散式追蹤
- **使用適當的日誌層級** — 正常請求使用 `Info`，4xx 使用 `Warn`，5xx 使用 `Error`
- **避免記錄敏感資料** — 從日誌輸出中排除密碼、令牌和個人識別資訊
- **設定 `GIN_MODE=release`** — 這會在正式環境中停用 Gin 的預設除錯日誌

## 另請參閱

- [如何寫入日誌檔案](/zh-tw/docs/logging/write-log/)
- [避免記錄查詢字串](/zh-tw/docs/logging/avoid-logging-query-strings/)
- [自訂日誌格式](/zh-tw/docs/logging/custom-log-format/)
