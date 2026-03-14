---
title: "Mendefinisikan format untuk log rute"
sidebar:
  order: 6
---

Log rute default adalah:
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Jika Anda ingin mencatat informasi ini dalam format tertentu (mis. JSON, key-value, atau lainnya), maka Anda dapat mendefinisikan format ini dengan `gin.DebugPrintRouteFunc`.
Dalam contoh di bawah, kami mencatat semua rute dengan paket log standar tetapi Anda dapat menggunakan alat log lain yang sesuai dengan kebutuhan Anda.
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
