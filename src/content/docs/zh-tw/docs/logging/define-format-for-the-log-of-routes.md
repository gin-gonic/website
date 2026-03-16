---
title: "定義路由日誌的格式"
sidebar:
  order: 6
---

當 Gin 啟動時，會在除錯模式下列印所有已註冊的路由。預設格式如下：

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

你可以透過指派一個函式給 `gin.DebugPrintRouteFunc` 來自訂此格式。如果你想以 JSON、鍵值對或其他日誌管線預期的格式來記錄路由，這會很有用。

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

當伺服器啟動時，你會看到以下輸出，而不是預設的 `[GIN-debug]` 行：

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## 另請參閱

- [自訂日誌格式](/zh-tw/docs/logging/custom-log-format/)
- [跳過日誌記錄](/zh-tw/docs/logging/skip-logging/)
