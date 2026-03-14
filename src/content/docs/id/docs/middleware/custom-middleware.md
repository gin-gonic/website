---
title: "Middleware Kustom"
sidebar:
  order: 3
---

Middleware Gin adalah fungsi yang mengembalikan `gin.HandlerFunc`. Middleware berjalan sebelum dan/atau setelah handler utama, yang membuatnya berguna untuk logging, autentikasi, penanganan error, dan kepentingan lintas-sektoral lainnya.

### Alur eksekusi middleware

Fungsi middleware memiliki dua fase, dipisahkan oleh pemanggilan `c.Next()`:

- **Sebelum `c.Next()`** -- Kode di sini berjalan sebelum permintaan mencapai handler utama. Gunakan fase ini untuk tugas pengaturan seperti mencatat waktu mulai, memvalidasi token, atau mengatur nilai context dengan `c.Set()`.
- **`c.Next()`** -- Ini memanggil handler berikutnya dalam rantai (yang bisa berupa middleware lain atau handler rute akhir). Eksekusi berhenti di sini sampai semua handler downstream selesai.
- **Setelah `c.Next()`** -- Kode di sini berjalan setelah handler utama selesai. Gunakan fase ini untuk pembersihan, mencatat status respons, atau mengukur latensi.

Jika Anda ingin menghentikan rantai sepenuhnya (misalnya, ketika autentikasi gagal), panggil `c.Abort()` alih-alih `c.Next()`. Ini mencegah handler yang tersisa dieksekusi. Anda dapat menggabungkannya dengan respons, misalnya `c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    t := time.Now()

    // Set example variable
    c.Set("example", "12345")

    // before request

    c.Next()

    // after request
    latency := time.Since(t)
    log.Print(latency)

    // access the status we are sending
    status := c.Writer.Status()
    log.Println(status)
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())

  r.GET("/test", func(c *gin.Context) {
    example := c.MustGet("example").(string)

    // it would print: "12345"
    log.Println(example)
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

### Coba jalankan

```bash
curl http://localhost:8080/test
```

Log server akan menampilkan latensi permintaan dan kode status HTTP untuk setiap permintaan yang melewati middleware `Logger`.

## Lihat juga

- [Middleware penanganan error](/id/docs/middleware/error-handling-middleware/)
- [Menggunakan middleware](/id/docs/middleware/using-middleware/)
