---
title: "跳過日誌記錄"
sidebar:
  order: 3
---

你可以使用 `LoggerConfig` 對特定路徑或基於自訂邏輯跳過日誌記錄。

使用 `SkipPaths` 排除特定路由不被記錄，使用 `Skip` 函式根據請求上下文進行自訂跳過邏輯。

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
