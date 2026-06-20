---
title: "Rota loglarının formatını tanımlama"
sidebar:
  order: 6
---

Gin başlatıldığında, debug modunda tüm kayıtlı rotaları yazdırır. Varsayılan format şu şekildedir:

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Bu formatı `gin.DebugPrintRouteFunc`'a bir fonksiyon atayarak özelleştirebilirsiniz. Bu, rotaları JSON, anahtar-değer çiftleri veya loglama altyapınızın beklediği herhangi bir formatta loglamak istediğinizde kullanışlıdır.

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

Sunucu başladığında, varsayılan `[GIN-debug]` satırları yerine şunu göreceksiniz:

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## Ayrıca bakınız

- [Özel log formatı](/tr/docs/logging/custom-log-format/)
- [Loglamayı atlama](/tr/docs/logging/skip-logging/)
