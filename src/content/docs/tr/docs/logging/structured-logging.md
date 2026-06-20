---
title: "Yapılandırılmış Loglama"
sidebar:
  order: 7
---

Yapılandırılmış loglama, düz metin yerine makine tarafından okunabilir log çıktısı (genellikle JSON) üretir. Bu, logları ELK Stack, Datadog veya Grafana Loki gibi log toplama sistemlerinde aramayı, filtrelemeyi ve analiz etmeyi kolaylaştırır.

## Neden yapılandırılmış loglama?

Gin'in varsayılan logger'ı, geliştirme için harika olan ancak ölçekte ayrıştırması zor olan insan tarafından okunabilir metin çıktısı verir. Yapılandırılmış loglama size şunları sağlar:

- **Sorgulanabilir alanlar** -- logları durum kodu, gecikme veya kullanıcı kimliğine göre filtreleme
- **Tutarlı format** -- her log girişi aynı şekle sahiptir
- **Korelasyon** -- istek kimliklerini kullanarak hizmetler arasında bir isteği izleme

## slog kullanımı (Go 1.21+)

Go'nun standart kütüphanesi, yapılandırılmış loglama için `log/slog` içerir. Gin ile nasıl kullanılacağı:

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

Bu, şu tarz log girişleri üretir:

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## İstek Kimliği / Korelasyon Kimliği

Her log girişine benzersiz bir istek kimliği eklemek, hizmetler arasında istekleri izlemeye yardımcı olur:

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

## zerolog kullanımı

[zerolog](https://github.com/rs/zerolog), popüler bir sıfır tahsisli JSON logger'dır:

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

## En iyi uygulamalar

- **Üretimde JSON formatı kullanın** -- geliştirme için insan tarafından okunabilir format, üretim log toplama için JSON
- **İstek kimlikleri ekleyin** -- dağıtılmış izleme için `X-Request-ID` başlıklarını hizmet sınırları boyunca yayın
- **Uygun düzeylerde loglayın** -- normal istekler için `Info`, 4xx için `Warn`, 5xx için `Error` kullanın
- **Hassas verileri loglamaktan kaçının** -- şifreleri, tokenları ve kişisel bilgileri log çıktısından hariç tutun
- **`GIN_MODE=release` ayarlayın** -- bu, üretimde Gin'in varsayılan hata ayıklama loglamasını devre dışı bırakır

## Ayrıca bakınız

- [Log dosyası nasıl yazılır](/tr/docs/logging/write-log/)
- [Sorgu dizelerini loglamaktan kaçınma](/tr/docs/logging/avoid-logging-query-strings/)
- [Özel log formatı](/tr/docs/logging/custom-log-format/)
