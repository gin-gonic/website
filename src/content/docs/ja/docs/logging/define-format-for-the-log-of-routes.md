---
title: "ルートログのフォーマット定義"
sidebar:
  order: 6
---

ルートのデフォルトログは以下の通りです：
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

この情報を特定のフォーマット（例：JSON、キーバリュー、その他）でログに記録したい場合は、`gin.DebugPrintRouteFunc`でこのフォーマットを定義できます。
以下の例では、標準logパッケージですべてのルートをログに記録していますが、ニーズに合った他のログツールを使用することもできます。
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

  // http://0.0.0.0:8080でリッスンしてサーブ
  router.Run()
}
```
