---
title: "라우트의 로그 형식을 정의"
draft: false
---

라우트의 기본 로그는 다음과 같습니다:
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

만약 로그 형식을 정의 하려면(JSON, 키-값 형식, 그 이외의 형식 등), `gin.DebugPrintRouteFunc`를 사용하여 정의할 수 있습니다.
아래의 예제는 모든 라우트에 대해 표준 로그 패키지를 사용하고 있지만, 필요에 따라 적절한 다른 도구를 사용하는 것도 가능합니다.
```go
import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
		log.Printf("endpoint %v %v %v %v\n", httpMethod, absolutePath, handlerName, nuHandlers)
	}

	r.POST("/foo", func(c *gin.Context) {
		c.JSON(http.StatusOK, "foo")
	})

	r.GET("/bar", func(c *gin.Context) {
		c.JSON(http.StatusOK, "bar")
	})

	r.GET("/status", func(c *gin.Context) {
		c.JSON(http.StatusOK, "ok")
	})

	// 서버가 실행 되고 http://0.0.0.0:8080 에서 요청을 기다립니다.
	r.Run()
}
```
