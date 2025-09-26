---
title: "Memulai ulang atau menghentikan dengan anggun"
---

Apakah Anda ingin memulai ulang atau menghentikan server web Anda dengan anggun?
Ada beberapa cara untuk melakukannya.

Kita dapat menggunakan [fvbock/endless](https://github.com/fvbock/endless) untuk menggantikan `ListenAndServe` bawaan. Lihat isu [#296](https://github.com/gin-gonic/gin/issues/296) untuk detail lebih lanjut.

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

Alternatif selain endless:

* [manners](https://github.com/braintree/manners): Server HTTP Go yang sopan yang mati dengan anggun.
* [graceful](https://github.com/tylerb/graceful): Graceful adalah paket Go yang memungkinkan penghentian yang anggun dari server http.Handler.
* [grace](https://github.com/facebookgo/grace): Memulai ulang dengan anggun & deploy tanpa waktu henti untuk server Go.

Jika Anda menggunakan Go 1.8 dan yang lebih baru, Anda mungkin tidak perlu menggunakan pustaka ini! Pertimbangkan untuk menggunakan metode `http.Server` bawaan [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) untuk penghentian yang anggun. Lihat contoh lengkap [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) dengan gin.

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
    // melayani koneksi
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()

  // Tunggu sinyal interrupt untuk mematikan server dengan anggun
  // dengan batas waktu 5 detik.
  quit := make(chan os.Signal, 1)
  // kill (tanpa parameter) secara bawaan mengirimkan syscall.SIGTERM
  // kill -2 adalah syscall.SIGINT
  // kill -9 adalah syscall.SIGKILL tetapi tidak dapat ditangkap, jadi tidak perlu menambahkannya
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

