---
title: "Zarif yeniden başlatma veya durdurma"
sidebar:
  order: 5
---

Bir sunucu işlemi sonlandırma sinyali aldığında (ör., bir dağıtım veya ölçekleme olayı sırasında), anında kapatma tüm devam eden istekleri düşürür ve istemcileri kopuk bağlantılar ve potansiyel olarak bozuk işlemlerle bırakır. **Zarif kapatma** bunu şu şekilde çözer:

- **Devam eden istekleri tamamlama** -- Zaten işlenmekte olan isteklere tamamlanmaları için zaman verilir, böylece istemciler bağlantı sıfırlamaları yerine uygun yanıtlar alır.
- **Bağlantıları boşaltma** -- Sunucu yeni bağlantıları kabul etmeyi durdururken mevcut olanların tamamlanmasına izin verilir, ani bir kesinti önlenir.
- **Kaynakları temizleme** -- Açık veritabanı bağlantıları, dosya tanıtıcıları ve arka plan çalışanları düzgün şekilde kapatılır, veri bozulması veya kaynak sızıntıları önlenir.
- **Sıfır kesintili dağıtımları etkinleştirme** -- Bir yük dengeleyici ile birleştirildiğinde, zarif kapatma kullanıcıya görünür herhangi bir hata olmadan yeni sürümleri yaymanıza olanak tanır.

Go'da bunu başarmanın birkaç yolu vardır.

Varsayılan `ListenAndServe`'i değiştirmek için [fvbock/endless](https://github.com/fvbock/endless) kullanabiliriz. Daha fazla ayrıntı için [#296](https://github.com/gin-gonic/gin/issues/296) numaralı konuya bakın.

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

endless'a alternatif:

* [manners](https://github.com/braintree/manners): Zarif şekilde kapanan kibar bir Go HTTP sunucusu.
* [graceful](https://github.com/tylerb/graceful): Graceful, bir http.Handler sunucusunun zarif şekilde kapatılmasını sağlayan bir Go paketidir.
* [grace](https://github.com/facebookgo/grace): Go sunucuları için zarif yeniden başlatma ve sıfır kesintili dağıtım.

Go 1.8 ve sonrasını kullanıyorsanız, bu kütüphaneyi kullanmanız gerekmeyebilir! Zarif kapatmalar için `http.Server`'ın yerleşik [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) metodunu kullanmayı düşünün. gin ile tam [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) örneğine bakın.

```go
//go:build go1.8
// +build go1.8

package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "Welcome Gin Server")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: router.Handler(),
  }

  go func() {
    // service connections
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()

  // Wait for interrupt signal to gracefully shutdown the server with
  // a timeout of 5 seconds.
  quit := make(chan os.Signal, 1)
  // kill (no params) by default sends syscall.SIGTERM
  // kill -2 is syscall.SIGINT
  // kill -9 is syscall.SIGKILL but can't be caught, so don't need add it
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Shutdown Server ...")

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  if err := srv.Shutdown(ctx); err != nil {
    log.Println("Server Shutdown:", err)
  }
  log.Println("Server exiting")
}
```

