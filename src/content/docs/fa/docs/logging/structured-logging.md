---
title: "لاگ‌گذاری ساختاریافته"
sidebar:
  order: 7
---

لاگ‌گذاری ساختاریافته خروجی لاگ قابل خواندن توسط ماشین (معمولاً JSON) به جای متن ساده تولید می‌کند. این کار جستجو، فیلتر و تحلیل لاگ‌ها را در سیستم‌های تجمیع لاگ مانند ELK Stack، Datadog یا Grafana Loki آسان‌تر می‌کند.

## چرا لاگ‌گذاری ساختاریافته؟

لاگر پیش‌فرض Gin متن قابل خواندن برای انسان خروجی می‌دهد که برای توسعه عالی است اما در مقیاس بزرگ تجزیه آن دشوار است. لاگ‌گذاری ساختاریافته به شما می‌دهد:

- **فیلدهای قابل پرس‌وجو** -- فیلتر لاگ‌ها بر اساس کد وضعیت، تأخیر یا شناسه کاربر
- **فرمت سازگار** -- هر ورودی لاگ شکل یکسانی دارد
- **همبستگی** -- ردیابی درخواست در سراسر سرویس‌ها با استفاده از شناسه‌های درخواست

## استفاده از slog (نسخه Go 1.21+)

کتابخانه استاندارد Go شامل `log/slog` برای لاگ‌گذاری ساختاریافته است. نحوه استفاده از آن با Gin:

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

این ورودی‌های لاگ مانند زیر تولید می‌کند:

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## شناسه درخواست / شناسه همبستگی

اضافه کردن یک شناسه درخواست منحصربه‌فرد به هر ورودی لاگ به ردیابی درخواست‌ها در سراسر سرویس‌ها کمک می‌کند:

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

## استفاده از zerolog

[zerolog](https://github.com/rs/zerolog) یک لاگر JSON محبوب بدون تخصیص حافظه است:

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

## بهترین روش‌ها

- **از فرمت JSON در تولید استفاده کنید** -- فرمت قابل خواندن برای انسان برای توسعه، JSON برای تجمیع لاگ تولیدی
- **شناسه‌های درخواست را شامل کنید** -- هدرهای `X-Request-ID` را در مرزهای سرویس برای ردیابی توزیع‌شده منتشر کنید
- **در سطوح مناسب لاگ کنید** -- از `Info` برای درخواست‌های عادی، `Warn` برای 4xx، `Error` برای 5xx استفاده کنید
- **از لاگ‌گذاری داده‌های حساس خودداری کنید** -- رمزهای عبور، توکن‌ها و PII را از خروجی لاگ حذف کنید
- **`GIN_MODE=release` تنظیم کنید** -- این لاگ‌گذاری اشکال‌زدایی پیش‌فرض Gin را در تولید غیرفعال می‌کند

## همچنین ببینید

- [نحوه نوشتن فایل لاگ](/en/docs/logging/write-log/)
- [جلوگیری از لاگ‌گذاری رشته‌های پرس‌وجو](/en/docs/logging/avoid-logging-query-strings/)
- [فرمت لاگ سفارشی](/en/docs/logging/custom-log-format/)
