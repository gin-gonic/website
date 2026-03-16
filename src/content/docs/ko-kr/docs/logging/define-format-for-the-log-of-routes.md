---
title: "라우트 로그 형식 정의"
sidebar:
  order: 6
---

Gin이 시작되면 디버그 모드에서 등록된 모든 라우트를 출력합니다. 기본 형식은 다음과 같습니다:

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

`gin.DebugPrintRouteFunc`에 함수를 할당하여 이 형식을 커스터마이즈할 수 있습니다. 이는 라우트를 JSON, 키-값 쌍 또는 로깅 파이프라인이 기대하는 다른 형식으로 로깅하려는 경우에 유용합니다.

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
    log.Printf("endpoint %v %v %v %v\n", httpMethod, absolutePath, handlerName, nuHandlers)
  }

  router.POST("/foo", func(c *gin.Context) {
    c.JSON(http.StatusOK, "foo")
  })

  router.GET("/bar", func(c *gin.Context) {
    c.JSON(http.StatusOK, "bar")
  })

  router.GET("/status", func(c *gin.Context) {
    c.JSON(http.StatusOK, "ok")
  })

  router.Run(":8080")
}
```

서버가 시작되면 기본 `[GIN-debug]` 줄 대신 다음과 같이 표시됩니다:

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## 참고

- [커스텀 로그 형식](/ko-kr/docs/logging/custom-log-format/)
- [로깅 건너뛰기](/ko-kr/docs/logging/skip-logging/)
