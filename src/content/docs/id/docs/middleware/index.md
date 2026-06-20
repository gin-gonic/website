---
title: "Middleware"
sidebar:
  order: 6
---

Middleware di Gin menyediakan cara untuk memproses permintaan HTTP sebelum mencapai handler rute. Fungsi middleware memiliki signature yang sama dengan handler rute -- `gin.HandlerFunc` -- dan biasanya memanggil `c.Next()` untuk meneruskan kontrol ke handler berikutnya dalam rantai.

## Cara kerja middleware

Gin menggunakan **model onion** untuk eksekusi middleware. Setiap middleware berjalan dalam dua fase:

1. **Pre-handler** -- kode sebelum `c.Next()` berjalan sebelum handler rute.
2. **Post-handler** -- kode setelah `c.Next()` berjalan setelah handler rute selesai.

Ini berarti middleware membungkus handler seperti lapisan bawang. Middleware pertama yang dipasang adalah lapisan terluar.

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // Pre-handler phase
    c.Next()

    // Post-handler phase
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## Memasang middleware

Ada tiga cara untuk memasang middleware di Gin:

```go
// 1. Global -- applies to all routes
router := gin.New()
router.Use(Logger(), Recovery())

// 2. Group -- applies to all routes in the group
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. Per-route -- applies to a single route
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

Middleware yang dipasang pada cakupan yang lebih luas berjalan terlebih dahulu. Dalam contoh di atas, permintaan ke `GET /v1/users` akan mengeksekusi `Logger` lalu `Recovery` lalu `AuthRequired` lalu `listUsers`.

## Dalam bagian ini

- [**Menggunakan middleware**](./using-middleware/) -- Memasang middleware secara global, ke grup, atau rute individual
- [**Middleware kustom**](./custom-middleware/) -- Menulis fungsi middleware Anda sendiri
- [**Menggunakan middleware BasicAuth**](./using-basicauth/) -- Autentikasi HTTP Basic
- [**Goroutine di dalam middleware**](./goroutines-inside-middleware/) -- Menjalankan tugas latar belakang dengan aman dari middleware
- [**Konfigurasi HTTP kustom**](./custom-http-config/) -- Penanganan error dan recovery dalam middleware
- [**Header keamanan**](./security-headers/) -- Mengatur header keamanan umum
