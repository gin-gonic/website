---
title: "Mendefinisikan format untuk log rute"
sidebar:
  order: 6
---

Ketika Gin dimulai, ia mencetak semua rute yang terdaftar dalam mode debug. Format default terlihat seperti ini:

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Anda dapat menyesuaikan format ini dengan menetapkan fungsi ke `gin.DebugPrintRouteFunc`. Ini berguna jika Anda ingin mencatat rute sebagai JSON, pasangan kunci-nilai, atau dalam format lain yang diharapkan oleh pipeline logging Anda.

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

Ketika server dimulai, alih-alih baris `[GIN-debug]` default, Anda akan melihat:

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## Lihat juga

- [Format log kustom](/id/docs/logging/custom-log-format/)
- [Melewati logging](/id/docs/logging/skip-logging/)
