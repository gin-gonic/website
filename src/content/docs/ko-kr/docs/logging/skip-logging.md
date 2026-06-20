---
title: "로깅 건너뛰기"
sidebar:
  order: 3
---

`LoggerConfig`를 사용하여 특정 경로 또는 커스텀 로직에 따라 로깅을 건너뛸 수 있습니다.

- `SkipPaths`는 특정 라우트를 로깅에서 제외합니다 -- 노이즈를 발생시키는 헬스 체크나 메트릭 엔드포인트에 유용합니다.
- `Skip`은 `*gin.Context`를 받아 `true`를 반환하면 로깅을 건너뛰는 함수입니다 -- 성공적인 응답 건너뛰기와 같은 조건부 로직에 유용합니다.

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

## 테스트

```sh
# This request is logged (status 501 >= 500)
curl http://localhost:8080/data

# This request is NOT logged (path in SkipPaths)
curl http://localhost:8080/metrics

# This request is NOT logged (status 200 < 500)
curl http://localhost:8080/ping
# Output: pong
```

## 참고

- [커스텀 로그 형식](/ko-kr/docs/logging/custom-log-format/)
- [로그 작성](/ko-kr/docs/logging/write-log/)
