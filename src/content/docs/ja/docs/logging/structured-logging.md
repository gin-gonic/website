---
title: "構造化ロギング"
sidebar:
  order: 7
---

構造化ロギングは、プレーンテキストの代わりに機械可読なログ出力（通常はJSON）を生成します。これにより、ELK Stack、Datadog、Grafana Lokiなどのログ集約システムでログの検索、フィルタリング、分析が容易になります。

## なぜ構造化ロギングか？

Ginのデフォルトロガーは人間が読みやすいテキストを出力しますが、大規模な環境ではパースが困難です。構造化ロギングにより以下が得られます：

- **クエリ可能なフィールド** -- ステータスコード、レイテンシ、ユーザーIDでログをフィルタリング
- **一貫したフォーマット** -- すべてのログエントリが同じ形式
- **相関** -- リクエストIDを使用してサービス間でリクエストを追跡

## slogの使用（Go 1.21以降）

Go標準ライブラリには構造化ロギング用の`log/slog`が含まれています。Ginでの使い方は以下の通りです：

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

これにより以下のようなログエントリが生成されます：

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## リクエストID / 相関ID

すべてのログエントリに一意のリクエストIDを追加することで、サービス間でリクエストを追跡できます：

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

## zerologの使用

[zerolog](https://github.com/rs/zerolog)は人気のあるゼロアロケーションJSONロガーです：

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

  // 開発用のプリティロギング
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

## ベストプラクティス

- **本番環境ではJSONフォーマットを使用** -- 開発には人間が読みやすいフォーマット、本番ログ集約にはJSON
- **リクエストIDを含める** -- 分散トレーシングのためにサービス間で`X-Request-ID`ヘッダーを伝搬
- **適切なレベルでログを記録** -- 通常のリクエストには`Info`、4xxには`Warn`、5xxには`Error`
- **機密データのロギングを避ける** -- パスワード、トークン、PIIをログ出力から除外
- **`GIN_MODE=release`を設定** -- 本番環境でGinのデフォルトデバッグロギングを無効化

## 関連項目

- [ログファイルの書き方](/ja/docs/logging/write-log/)
- [クエリ文字列のロギングを回避](/ja/docs/logging/avoid-logging-query-strings/)
- [カスタムログフォーマット](/ja/docs/logging/custom-log-format/)
