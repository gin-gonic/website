---
title: "Logging Terstruktur"
sidebar:
  order: 7
---

Logging terstruktur menghasilkan output log yang dapat dibaca mesin (biasanya JSON) alih-alih teks biasa. Ini membuat log lebih mudah dicari, difilter, dan dianalisis dalam sistem agregasi log seperti ELK Stack, Datadog, atau Grafana Loki.

## Mengapa logging terstruktur?

Logger default Gin menghasilkan teks yang mudah dibaca manusia, yang bagus untuk pengembangan tetapi sulit di-parse dalam skala besar. Logging terstruktur memberi Anda:

- **Field yang dapat di-query** -- filter log berdasarkan kode status, latensi, atau ID pengguna
- **Format konsisten** -- setiap entri log memiliki bentuk yang sama
- **Korelasi** -- lacak permintaan di seluruh layanan menggunakan request ID

## Menggunakan slog (Go 1.21+)

Pustaka standar Go menyertakan `log/slog` untuk logging terstruktur. Berikut cara menggunakannya dengan Gin:

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

Ini menghasilkan entri log seperti:

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## Request ID / Correlation ID

Menambahkan request ID unik ke setiap entri log membantu melacak permintaan di seluruh layanan:

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

## Menggunakan zerolog

[zerolog](https://github.com/rs/zerolog) adalah logger JSON populer tanpa alokasi:

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

## Praktik terbaik

- **Gunakan format JSON di produksi** -- format yang mudah dibaca manusia untuk pengembangan, JSON untuk agregasi log produksi
- **Sertakan request ID** -- propagasi header `X-Request-ID` di seluruh batas layanan untuk distributed tracing
- **Log pada level yang tepat** -- gunakan `Info` untuk permintaan normal, `Warn` untuk 4xx, `Error` untuk 5xx
- **Hindari logging data sensitif** -- kecualikan password, token, dan PII dari output log
- **Atur `GIN_MODE=release`** -- ini menonaktifkan logging debug default Gin di produksi

## Lihat juga

- [Cara menulis file log](/id/docs/logging/write-log/)
- [Menghindari logging query string](/id/docs/logging/avoid-logging-query-strings/)
- [Format log kustom](/id/docs/logging/custom-log-format/)
