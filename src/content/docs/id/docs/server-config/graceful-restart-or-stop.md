---
title: "Restart atau stop graceful"
sidebar:
  order: 5
---

Ketika proses server menerima sinyal terminasi (mis., selama deployment atau event scaling), shutdown langsung akan memutus semua permintaan yang sedang diproses, meninggalkan klien dengan koneksi terputus dan operasi yang berpotensi rusak. **Shutdown graceful** menyelesaikan ini dengan:

- **Menyelesaikan permintaan yang sedang diproses** -- Permintaan yang sudah sedang diproses diberi waktu untuk selesai, sehingga klien menerima respons yang benar alih-alih reset koneksi.
- **Mengosongkan koneksi** -- Server berhenti menerima koneksi baru sementara koneksi yang ada diizinkan untuk selesai, mencegah pemutusan mendadak.
- **Membersihkan sumber daya** -- Koneksi database terbuka, handle file, dan worker latar belakang ditutup dengan benar, menghindari kerusakan data atau kebocoran sumber daya.
- **Mengaktifkan deployment tanpa downtime** -- Ketika dikombinasikan dengan load balancer, shutdown graceful memungkinkan Anda meluncurkan versi baru tanpa error yang terlihat oleh pengguna.

Ada beberapa cara untuk mencapai ini di Go.

Kita dapat menggunakan [fvbock/endless](https://github.com/fvbock/endless) untuk menggantikan `ListenAndServe` default. Merujuk issue [#296](https://github.com/gin-gonic/gin/issues/296) untuk detail lebih lanjut.

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

Alternatif untuk endless:

* [manners](https://github.com/braintree/manners): Server HTTP Go yang sopan yang melakukan shutdown secara graceful.
* [graceful](https://github.com/tylerb/graceful): Graceful adalah paket Go yang mengaktifkan shutdown graceful dari server http.Handler.
* [grace](https://github.com/facebookgo/grace): Restart graceful & deploy tanpa downtime untuk server Go.

Jika Anda menggunakan Go 1.8 dan lebih baru, Anda mungkin tidak perlu menggunakan pustaka ini! Pertimbangkan menggunakan metode bawaan [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) dari `http.Server` untuk shutdown graceful. Lihat contoh lengkap [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) dengan gin.

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

