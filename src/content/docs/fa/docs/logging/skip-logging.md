---
title: "رد شدن از لاگ‌گذاری"
sidebar:
  order: 3
---

می‌توانید با استفاده از `LoggerConfig` از لاگ‌گذاری برای مسیرهای خاص یا بر اساس منطق سفارشی رد شوید.

از `SkipPaths` برای حذف مسیرهای خاص از لاگ‌گذاری و از تابع `Skip` برای منطق رد شدن سفارشی بر اساس context درخواست استفاده کنید.

```go
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

  // skipped
  router.GET("/metrics", func(c *gin.Context) {
      c.Status(http.StatusNotImplemented)
  })

  // skipped
  router.GET("/ping", func(c *gin.Context) {
      c.String(http.StatusOK, "pong")
  })

  // not skipped
  router.GET("/data", func(c *gin.Context) {
    c.Status(http.StatusNotImplemented)
  })

  router.Run(":8080")
}
```
