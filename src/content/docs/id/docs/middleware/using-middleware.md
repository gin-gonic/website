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

**Urutan eksekusi:** Fungsi middleware dieksekusi sesuai urutan pendaftarannya. Ketika middleware memanggil `c.Next()`, ia meneruskan kontrol ke middleware berikutnya (atau handler akhir), dan kemudian melanjutkan eksekusi setelah `c.Next()` selesai. Ini menciptakan pola seperti stack (LIFO) -- middleware pertama yang didaftarkan adalah yang pertama dimulai tetapi terakhir selesai. Jika middleware tidak memanggil `c.Next()`, middleware dan handler selanjutnya dilewati (berguna untuk short-circuiting dengan `c.Abort()`).

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
