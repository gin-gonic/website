---
title: "로깅 건너뛰기"
sidebar:
  order: 3
---

`LoggerConfig`를 사용하여 특정 경로나 커스텀 로직에 기반하여 로깅을 건너뛸 수 있습니다.

`SkipPaths`를 사용하여 특정 라우트를 로깅에서 제외하고, `Skip` 함수를 사용하여 요청 컨텍스트에 기반한 커스텀 건너뛰기 로직을 구현합니다.

```go
func main() {
  router := gin.New()

  // LoggerConfig에서 SkipPaths를 설정하여 원하는 경로의 로깅을 건너뜁니다
  loggerConfig := gin.LoggerConfig{SkipPaths: []string{"/metrics"}}

  // LoggerConfig에서 Skip 함수를 설정하여 로직에 따라 로깅을 건너뜁니다
  loggerConfig.Skip = func(c *gin.Context) bool {
      // 예를 들어 서버 측 오류가 아닌 것을 건너뜁니다
      return c.Writer.Status() < http.StatusInternalServerError
  }

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  // 건너뜀
  router.GET("/metrics", func(c *gin.Context) {
      c.Status(http.StatusNotImplemented)
  })

  // 건너뜀
  router.GET("/ping", func(c *gin.Context) {
      c.String(http.StatusOK, "pong")
  })

  // 건너뛰지 않음
  router.GET("/data", func(c *gin.Context) {
    c.Status(http.StatusNotImplemented)
  })

  router.Run(":8080")
}
```
