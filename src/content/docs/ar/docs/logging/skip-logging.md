---
title: "تخطي التسجيل"
sidebar:
  order: 3
---

يمكنك تخطي التسجيل لمسارات محددة أو بناءً على منطق مخصص باستخدام `LoggerConfig`.

استخدم `SkipPaths` لاستبعاد مسارات محددة من التسجيل، ودالة `Skip` لمنطق تخطي مخصص بناءً على سياق الطلب.

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
