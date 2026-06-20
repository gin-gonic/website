---
title: "ルートログのフォーマット定義"
sidebar:
  order: 6
---

Ginが起動すると、デバッグモードで登録されたすべてのルートを出力します。デフォルトのフォーマットは以下のようになります：

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

`gin.DebugPrintRouteFunc` に関数を割り当てることで、このフォーマットをカスタマイズできます。これは、ルートをJSON、キーバリューペア、またはログパイプラインが期待するその他のフォーマットでログに記録したい場合に便利です。

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

サーバーが起動すると、デフォルトの `[GIN-debug]` 行の代わりに以下が表示されます：

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## 関連項目

- [カスタムログフォーマット](/ja/docs/logging/custom-log-format/)
- [ロギングのスキップ](/ja/docs/logging/skip-logging/)
