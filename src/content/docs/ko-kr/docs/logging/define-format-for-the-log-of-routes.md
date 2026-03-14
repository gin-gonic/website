---
title: "라우트 로그 형식 정의"
sidebar:
  order: 6
---

라우트의 기본 로그는 다음과 같습니다:
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

이 정보를 특정 형식(예: JSON, 키-값 또는 기타)으로 로깅하려면 `gin.DebugPrintRouteFunc`로 형식을 정의할 수 있습니다.
아래 예제에서는 표준 log 패키지로 모든 라우트를 로깅하지만, 필요에 맞는 다른 로그 도구를 사용할 수 있습니다.
```go
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

  // http://0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run()
}
```
