---
title: "定義路由日誌的格式"
sidebar:
  order: 6
---

路由的預設日誌格式為：
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

如果你想以指定格式（例如 JSON、鍵值對或其他格式）記錄此資訊，可以使用 `gin.DebugPrintRouteFunc` 定義此格式。
在以下範例中，我們使用標準 log 套件記錄所有路由，但你可以使用其他符合需求的日誌工具。
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
