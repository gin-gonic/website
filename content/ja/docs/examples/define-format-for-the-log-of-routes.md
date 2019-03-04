---
title: "ルーティングログのフォーマットを定義する"
draft: false
---

デフォルトのルーティングログは以下のようになります。
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

もしログのフォーマットを定義したい(JSONやキーバリュー形式、その他)なら、`gin.DebugPrintRouteFunc` を定義することで可能です。
以下のサンプルコードでは、すべてのルーティングを標準の log パッケージで記録していますが、必要に応じて最適な別のログツールを利用することも可能です。

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

	// http://0.0.0.0:8080 でサーバーを立てる
	r.Run()
}
```
