---
title: "Menjalankan beberapa layanan"
sidebar:
  order: 4
---

Anda dapat menjalankan beberapa server Gin dalam satu proses — masing-masing pada port yang berbeda — dengan menggunakan `errgroup.Group` dari paket `golang.org/x/sync/errgroup`. Ini berguna ketika Anda perlu mengekspos API terpisah (misalnya, API publik di port 8080 dan API admin di port 8081) tanpa men-deploy binary terpisah.

Setiap server mendapatkan router, stack middleware, dan konfigurasi `http.Server` sendiri.

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

## Uji coba

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
Jika salah satu server gagal dimulai (misalnya, jika port sudah digunakan), `g.Wait()` mengembalikan error pertama. Kedua server harus berhasil dimulai agar proses tetap berjalan.
:::

## Lihat juga

- [Konfigurasi HTTP kustom](/id/docs/server-config/custom-http-config/)
- [Restart atau stop secara graceful](/id/docs/server-config/graceful-restart-or-stop/)
