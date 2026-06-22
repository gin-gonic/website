---
title: "Özel kurtarma davranışı"
sidebar:
  order: 4
---

Gin'in yerleşik `gin.Recovery()` ara katmanı, bir istek işlenirken oluşan herhangi bir panic'i yakalar, `500` yanıtı yazar ve sunucuyu çalışır durumda tutar. Kurtarma sırasında ne olacağını kontrol etmeniz gerektiğinde -- örneğin panic'i kullanıcıya bildirmek, bir veritabanına kaydetmek veya bir hata izleme servisine göndermek için -- bunun yerine `gin.CustomRecovery()` kullanın.

`gin.CustomRecovery()`, `func(c *gin.Context, recovered any)` imzasına sahip bir işleyici alır. `recovered` değeri, `panic()` çağrısına geçirilen şeydir. İşleyici içinde nasıl yanıt vereceğinize karar verir, ardından kalan işleyicilerin atlanması için `c.AbortWithStatus()` (veya başka bir abort metodu) çağırırsınız.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  r := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  r.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  r.Use(gin.CustomRecovery(func(c *gin.Context, recovered any) {
    if err, ok := recovered.(string); ok {
      c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
    }
    c.AbortWithStatus(http.StatusInternalServerError)
  }))

  r.GET("/panic", func(c *gin.Context) {
    // panic with a string -- the custom middleware could save this to a database or report it to the user
    panic("foo")
  })

  r.GET("/", func(c *gin.Context) {
    c.String(http.StatusOK, "ohai")
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

## Deneyin

```bash
# Triggers the panic; the custom recovery handler returns the message
curl http://localhost:8080/panic
# => error: foo

# A normal request still works
curl http://localhost:8080/
# => ohai
```

## Ayrıca bakınız

- [Özel ara katman](/tr/docs/middleware/custom-middleware/)
- [Varsayılan olarak ara katmansız boş Gin](/tr/docs/middleware/without-middleware/)
- [Hata işleme ara katmanı](/tr/docs/middleware/error-handling-middleware/)
