---
title: "跳过日志记录"
sidebar:
  order: 3
---

你可以使用 `LoggerConfig` 跳过特定路径或基于自定义逻辑的日志记录。

- `SkipPaths` 排除特定路由的日志记录——适用于会产生噪音的健康检查或指标端点。
- `Skip` 是一个接收 `*gin.Context` 并返回 `true` 来跳过日志记录的函数——适用于条件逻辑，如跳过成功响应的日志。

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

## 测试

```sh
# This request is logged (status 501 >= 500)
curl http://localhost:8080/data

# This request is NOT logged (path in SkipPaths)
curl http://localhost:8080/metrics

# This request is NOT logged (status 200 < 500)
curl http://localhost:8080/ping
# Output: pong
```

## 另请参阅

- [自定义日志格式](/zh-cn/docs/logging/custom-log-format/)
- [写入日志](/zh-cn/docs/logging/write-log/)
