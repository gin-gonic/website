---
title: "Konfigurasi HTTP kustom"
sidebar:
  order: 1
---

Secara default, `router.Run()` memulai server HTTP dasar. Untuk penggunaan produksi, Anda mungkin perlu menyesuaikan timeout, batas header, atau pengaturan TLS. Anda dapat melakukan ini dengan membuat `http.Server` sendiri dan meneruskan router Gin sebagai `Handler`.

## Penggunaan dasar

Teruskan router Gin langsung ke `http.ListenAndServe`:

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

## Dengan pengaturan server kustom

Buat struct `http.Server` untuk mengonfigurasi timeout baca/tulis dan opsi lainnya:

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

## Uji coba

```sh
curl http://localhost:8080/ping
# Output: pong
```

## Lihat juga

- [Restart atau stop secara graceful](/id/docs/server-config/graceful-restart-or-stop/)
- [Menjalankan beberapa layanan](/id/docs/server-config/run-multiple-service/)
