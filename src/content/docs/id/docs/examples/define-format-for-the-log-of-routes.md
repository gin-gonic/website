---
title: "Mendefinisikan format log untuk route"
---

Log bawaan dari route adalah:
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Jika Anda ingin mencatat informasi ini dalam format tertentu (misalnya JSON, key-value, atau yang lainnya), maka Anda dapat mendefinisikan format ini dengan `gin.DebugPrintRouteFunc`.
Pada contoh di bawah, kami mencatat semua route dengan paket log standar, tetapi Anda dapat menggunakan tools log lain yang sesuai dengan kebutuhan Anda.
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

  // Jalankan server pada http://0.0.0.0:8080
  router.Run()
}
```
