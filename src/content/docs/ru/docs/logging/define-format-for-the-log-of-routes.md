---
title: "Формат лога маршрутов"
sidebar:
  order: 6
---

Формат лога маршрутов по умолчанию:
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Если вы хотите логировать эту информацию в заданном формате (например, JSON, ключ-значение или что-то другое), вы можете определить этот формат с помощью `gin.DebugPrintRouteFunc`.
В примере ниже мы логируем все маршруты с помощью стандартного пакета log, но вы можете использовать другой инструмент логирования, который соответствует вашим потребностям.
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

  // Listen and Server in http://0.0.0.0:8080
  router.Run()
}
```
