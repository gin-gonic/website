---
title: "ロギングのスキップ"
sidebar:
  order: 3
---

`LoggerConfig`を使用して、特定のパスやカスタムロジックに基づいてロギングをスキップできます。

`SkipPaths`で特定のルートをロギングから除外し、`Skip`関数でリクエストコンテキストに基づくカスタムスキップロジックを使用します。

```go
func main() {
  router := gin.New()

  // LoggerConfigでSkipPathsを設定して、指定のパスのロギングをスキップ
  loggerConfig := gin.LoggerConfig{SkipPaths: []string{"/metrics"}}

  // LoggerConfigでSkip関数を設定して、ロジックに基づいてロギングをスキップ
  loggerConfig.Skip = func(c *gin.Context) bool {
      // 例としてサーバーサイドエラー以外をスキップ
      return c.Writer.Status() < http.StatusInternalServerError
  }

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  // スキップされる
  router.GET("/metrics", func(c *gin.Context) {
      c.Status(http.StatusNotImplemented)
  })

  // スキップされる
  router.GET("/ping", func(c *gin.Context) {
      c.String(http.StatusOK, "pong")
  })

  // スキップされない
  router.GET("/data", func(c *gin.Context) {
    c.Status(http.StatusNotImplemented)
  })

  router.Run(":8080")
}
```
