---
title: "定義路由日誌的格式"
---

路由的預設日誌如下：

```sh
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

如果您想以給定的格式（例如 JSON、鍵值對或其他格式）記錄此資訊，
您可以使用 `gin.DebugPrintRouteFunc` 定義此格式。
在下面的範例中，我們使用標準日誌套件記錄所有路由，
但您也可以使用適合您需求的其他日誌工具。

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

  // 在 http://0.0.0.0:8080 上監聽並提供服務
  router.Run()
}
```
