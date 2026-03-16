---
title: "跳過日誌記錄"
sidebar:
  order: 3
---

你可以使用 `LoggerConfig` 對特定路徑或基於自訂邏輯跳過日誌記錄。

- `SkipPaths` 排除特定路由不被記錄——適用於會產生大量雜訊的健康檢查或指標端點。
- `Skip` 是一個接收 `*gin.Context` 並回傳 `true` 以跳過記錄的函式——適用於條件邏輯，例如跳過成功的回應。

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

## 測試

```sh
# This request is logged (status 501 >= 500)
curl http://localhost:8080/data

# This request is NOT logged (path in SkipPaths)
curl http://localhost:8080/metrics

# This request is NOT logged (status 200 < 500)
curl http://localhost:8080/ping
# Output: pong
```

## 另請參閱

- [自訂日誌格式](/zh-tw/docs/logging/custom-log-format/)
- [寫入日誌](/zh-tw/docs/logging/write-log/)
