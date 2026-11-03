---
title: "Menggunakan middleware"
sidebar:
  order: 2
---

Middleware di Gin adalah fungsi yang berjalan sebelum (dan opsional setelah) handler rute Anda. Middleware digunakan untuk kepentingan lintas-sektoral seperti logging, autentikasi, recovery error, dan modifikasi permintaan.

Gin mendukung tiga level pemasangan middleware:

- **Middleware global** -- Diterapkan ke setiap rute dalam router. Didaftarkan dengan `router.Use()`. Baik untuk kepentingan seperti logging dan recovery panic yang berlaku secara universal.
- **Middleware grup** -- Diterapkan ke semua rute dalam grup rute. Didaftarkan dengan `group.Use()`. Berguna untuk menerapkan autentikasi atau otorisasi ke subset rute (mis., semua rute `/admin/*`).
- **Middleware per-rute** -- Diterapkan ke satu rute saja. Diteruskan sebagai argumen tambahan ke `router.GET()`, `router.POST()`, dll. Berguna untuk logika spesifik rute seperti rate limiting kustom atau validasi input.

**Urutan eksekusi:** Fungsi middleware dieksekusi sesuai urutan pendaftarannya. Pemanggilan `c.Next()` mengeksekusi handler yang tersisa, lalu melanjutkan middleware saat ini setelah `c.Next()` selesai. Ini memungkinkan kode berjalan sebelum dan sesudah handler berikutnya; ketika middleware membungkus handler berikutnya dengan cara ini, pemrosesan setelahnya berjalan dalam urutan terbalik (LIFO).

Jika middleware kembali tanpa memanggil `c.Next()`, middleware berikutnya dan handler tetap dieksekusi kecuali konteks telah dibatalkan. Untuk melewati handler yang belum dieksekusi, panggil `c.Abort()` atau metode `AbortWithStatus*`. Pembatalan tidak menghentikan fungsi middleware saat ini, jadi gunakan `return` jika Anda juga ingin menghentikan eksekusi sisa kode fungsi tersebut.

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  router := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  router.Use(gin.Recovery())

  // Per route middleware, you can add as many as you desire.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Authorization group
  // authorized := router.Group("/", AuthRequired())
  // exactly the same as:
  authorized := router.Group("/")
  // per group middleware! in this case we use the custom created
  // AuthRequired() middleware just in the "authorized" group.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // nested group
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
`gin.Default()` adalah fungsi praktis yang membuat router dengan middleware `Logger` dan `Recovery` yang sudah terpasang. Jika Anda ingin router kosong tanpa middleware, gunakan `gin.New()` seperti ditunjukkan di atas dan tambahkan hanya middleware yang Anda butuhkan.
:::
