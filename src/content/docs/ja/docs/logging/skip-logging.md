---
title: "ロギングのスキップ"
sidebar:
  order: 3
---

`LoggerConfig` を使用して、特定のパスやカスタムロジックに基づいてロギングをスキップできます。

- `SkipPaths` は特定のルートをロギングから除外します。ノイズを生成するヘルスチェックやメトリクスエンドポイントに便利です。
- `Skip` は `*gin.Context` を受け取り、ロギングをスキップする場合に `true` を返す関数です。成功したレスポンスのスキップなどの条件付きロジックに便利です。

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

## テスト

```sh
# This request is logged (status 501 >= 500)
curl http://localhost:8080/data

# This request is NOT logged (path in SkipPaths)
curl http://localhost:8080/metrics

# This request is NOT logged (status 200 < 500)
curl http://localhost:8080/ping
# Output: pong
```

## 関連項目

- [カスタムログフォーマット](/ja/docs/logging/custom-log-format/)
- [ログの書き込み](/ja/docs/logging/write-log/)
