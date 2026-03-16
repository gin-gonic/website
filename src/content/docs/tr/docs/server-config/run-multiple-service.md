---
title: "Birden fazla servis çalıştırma"
sidebar:
  order: 4
---

`golang.org/x/sync/errgroup` paketinden `errgroup.Group` kullanarak aynı süreçte birden fazla Gin sunucusunu — her biri farklı bir portta — çalıştırabilirsiniz. Bu, ayrı API'ler sunmanız gerektiğinde kullanışlıdır (örneğin, 8080 portunda genel API ve 8081 portunda yönetici API'si) ve ayrı ikili dosyalar dağıtmak istemezsiniz.

Her sunucu kendi yönlendiricisine, ara katman yığınına ve `http.Server` yapılandırmasına sahip olur.

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "golang.org/x/sync/errgroup"
)

var (
  g errgroup.Group
)

func router01() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 01",
    })
  })

  return e
}

func router02() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 02",
    })
  })

  return e
}

func main() {
  server01 := &http.Server{
    Addr:         ":8080",
    Handler:      router01(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  server02 := &http.Server{
    Addr:         ":8081",
    Handler:      router02(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  g.Go(func() error {
    return server01.ListenAndServe()
  })

  g.Go(func() error {
    return server02.ListenAndServe()
  })

  if err := g.Wait(); err != nil {
    log.Fatal(err)
  }
}
```

## Test et

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
Herhangi bir sunucu başlatılamazsa (örneğin, bir port zaten kullanımdaysa), `g.Wait()` ilk hatayı döndürür. Sürecin çalışmaya devam etmesi için her iki sunucunun da başarıyla başlaması gerekir.
:::

## Ayrıca bakınız

- [Özel HTTP yapılandırması](/tr/docs/server-config/custom-http-config/)
- [Zarif yeniden başlatma veya durdurma](/tr/docs/server-config/graceful-restart-or-stop/)
