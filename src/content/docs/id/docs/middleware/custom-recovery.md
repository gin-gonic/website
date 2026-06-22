---
title: "Perilaku Recovery Kustom"
sidebar:
  order: 4
---

Middleware bawaan Gin `gin.Recovery()` menangkap setiap panic yang terjadi saat menangani sebuah permintaan, menulis respons `500`, dan menjaga server tetap berjalan. Ketika Anda perlu mengontrol apa yang terjadi saat recovery -- misalnya untuk melaporkan panic kepada pengguna, menyimpannya ke database, atau mengirimnya ke layanan pelacakan error -- gunakan `gin.CustomRecovery()` sebagai gantinya.

`gin.CustomRecovery()` menerima sebuah handler dengan signature `func(c *gin.Context, recovered any)`. Nilai `recovered` adalah apa pun yang diteruskan ke `panic()`. Di dalam handler Anda menentukan cara merespons, lalu memanggil `c.AbortWithStatus()` (atau metode abort lainnya) sehingga handler yang tersisa dilewati.

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

## Coba jalankan

```bash
# Triggers the panic; the custom recovery handler returns the message
curl http://localhost:8080/panic
# => error: foo

# A normal request still works
curl http://localhost:8080/
# => ohai
```

## Lihat juga

- [Middleware Kustom](/id/docs/middleware/custom-middleware/)
- [Gin kosong tanpa middleware secara default](/id/docs/middleware/without-middleware/)
- [Middleware penanganan error](/id/docs/middleware/error-handling-middleware/)
