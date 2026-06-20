---
title: "Özel HTTP yapılandırması"
sidebar:
  order: 1
---

Varsayılan olarak, `router.Run()` temel bir HTTP sunucusu başlatır. Üretim kullanımı için zaman aşımlarını, başlık limitlerini veya TLS ayarlarını özelleştirmeniz gerekebilir. Bunu, kendi `http.Server`'ınızı oluşturarak ve Gin yönlendiriciyi `Handler` olarak geçirerek yapabilirsiniz.

## Temel kullanım

Gin yönlendiriciyi doğrudan `http.ListenAndServe`'e geçirin:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  http.ListenAndServe(":8080", router)
}
```

## Özel sunucu ayarlarıyla

Okuma/yazma zaman aşımlarını ve diğer seçenekleri yapılandırmak için bir `http.Server` struct'ı oluşturun:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

## Test et

```sh
curl http://localhost:8080/ping
# Output: pong
```

## Ayrıca bakınız

- [Zarif yeniden başlatma veya durdurma](/tr/docs/server-config/graceful-restart-or-stop/)
- [Birden fazla servis çalıştırma](/tr/docs/server-config/run-multiple-service/)
