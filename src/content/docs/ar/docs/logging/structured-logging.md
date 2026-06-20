---
title: "التسجيل المنظم"
sidebar:
  order: 7
---

ينتج التسجيل المنظم مخرجات سجل قابلة للقراءة آلياً (عادةً JSON) بدلاً من النص العادي. هذا يجعل السجلات أسهل للبحث والتصفية والتحليل في أنظمة تجميع السجلات مثل ELK Stack أو Datadog أو Grafana Loki.

## لماذا التسجيل المنظم؟

يُخرج مسجّل Gin الافتراضي نصاً مقروءاً للبشر، وهو رائع للتطوير لكن صعب التحليل على نطاق واسع. يمنحك التسجيل المنظم:

- **حقول قابلة للاستعلام** -- تصفية السجلات حسب رمز الحالة أو التأخير أو معرّف المستخدم
- **تنسيق متسق** -- كل إدخال سجل له نفس الشكل
- **الارتباط** -- تتبع طلب عبر الخدمات باستخدام معرّفات الطلب

## استخدام slog (Go 1.21+)

تتضمن مكتبة Go القياسية `log/slog` للتسجيل المنظم. إليك كيفية استخدامه مع Gin:

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

ينتج هذا إدخالات سجل مثل:

```json
{"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"request","method":"GET","path":"/ping","query":"","status":200,"latency":"125µs","client_ip":"127.0.0.1","body_size":18}
```

## معرّف الطلب / معرّف الارتباط

إضافة معرّف طلب فريد لكل إدخال سجل يساعد في تتبع الطلبات عبر الخدمات:

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

## استخدام zerolog

[zerolog](https://github.com/rs/zerolog) هو مسجّل JSON شائع بدون تخصيصات:

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

## أفضل الممارسات

- **استخدم تنسيق JSON في الإنتاج** -- تنسيق مقروء للتطوير، JSON لتجميع سجلات الإنتاج
- **ضمّن معرّفات الطلب** -- انشر ترويسات `X-Request-ID` عبر حدود الخدمات للتتبع الموزع
- **سجّل بالمستويات المناسبة** -- استخدم `Info` للطلبات العادية، `Warn` لـ 4xx، `Error` لـ 5xx
- **تجنب تسجيل البيانات الحساسة** -- استبعد كلمات المرور والرموز والمعلومات الشخصية من مخرجات السجل
- **عيّن `GIN_MODE=release`** -- هذا يعطّل تسجيل التصحيح الافتراضي لـ Gin في الإنتاج

## انظر أيضاً

- [كيفية كتابة ملف السجل](/ar/docs/logging/write-log/)
- [تجنب تسجيل سلاسل الاستعلام](/ar/docs/logging/avoid-logging-query-strings/)
- [تنسيق سجل مخصص](/ar/docs/logging/custom-log-format/)
