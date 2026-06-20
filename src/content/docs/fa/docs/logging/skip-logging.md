---
title: "رد شدن از لاگ‌گذاری"
sidebar:
  order: 3
---

می‌توانید با استفاده از `LoggerConfig` از لاگ‌گذاری برای مسیرهای خاص یا بر اساس منطق سفارشی رد شوید.

- `SkipPaths` مسیرهای خاص را از لاگ‌گذاری حذف می‌کند -- مفید برای endpointهای بررسی سلامت یا متریک‌ها که نویز ایجاد می‌کنند.
- `Skip` تابعی است که `*gin.Context` دریافت می‌کند و `true` برمی‌گرداند تا از لاگ‌گذاری رد شود -- مفید برای منطق شرطی مانند رد شدن از پاسخ‌های موفق.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.New()

  // skip logging for desired paths by setting SkipPaths in LoggerConfig
  loggerConfig := gin.LoggerConfig{SkipPaths: []string{"/metrics"}}

  // skip logging based on your logic by setting Skip func in LoggerConfig
  loggerConfig.Skip = func(c *gin.Context) bool {
    // as an example skip non server side errors
    return c.Writer.Status() < http.StatusInternalServerError
  }

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  // skipped -- path is in SkipPaths
  router.GET("/metrics", func(c *gin.Context) {
    c.Status(http.StatusNotImplemented)
  })

  // skipped -- status < 500
  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  // not skipped -- status is 501 (>= 500)
  router.GET("/data", func(c *gin.Context) {
    c.Status(http.StatusNotImplemented)
  })

  router.Run(":8080")
}
```

## تست

```sh
# This request is logged (status 501 >= 500)
curl http://localhost:8080/data

# This request is NOT logged (path in SkipPaths)
curl http://localhost:8080/metrics

# This request is NOT logged (status 200 < 500)
curl http://localhost:8080/ping
# Output: pong
```

## همچنین ببینید

- [فرمت لاگ سفارشی](/fa/docs/logging/custom-log-format/)
- [نوشتن لاگ](/fa/docs/logging/write-log/)
