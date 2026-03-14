---
title: "Rota loglarının formatını tanımlama"
sidebar:
  order: 6
---

Varsayılan rota logu şu şekildedir:
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Bu bilgiyi belirli bir formatta (ör. JSON, anahtar-değer çiftleri veya başka bir şekilde) loglamak istiyorsanız, `gin.DebugPrintRouteFunc` ile bu formatı tanımlayabilirsiniz.
Aşağıdaki örnekte, tüm rotaları standart log paketi ile logluyoruz ancak ihtiyaçlarınıza uygun başka bir log aracı kullanabilirsiniz.
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
