---
title: "Dokumentasi"
sidebar:
  order: 20
---

Gin adalah framework web HTTP berperforma tinggi yang ditulis dalam [Go](https://go.dev/). Gin menyediakan API mirip Martini tetapi dengan performa yang jauh lebih baik—hingga 40 kali lebih cepat—berkat [httprouter](https://github.com/julienschmidt/httprouter). Gin dirancang untuk membangun REST API, aplikasi web, dan microservice di mana kecepatan dan produktivitas pengembang sangat penting.

**Mengapa memilih Gin?**

Gin menggabungkan kesederhanaan routing bergaya Express.js dengan karakteristik performa Go, menjadikannya ideal untuk:

- Membangun REST API berthroughput tinggi
- Mengembangkan microservice yang perlu menangani banyak permintaan bersamaan
- Membuat aplikasi web yang membutuhkan waktu respons cepat
- Membuat prototipe layanan web dengan cepat dengan boilerplate minimal

**Fitur utama Gin:**

- **Router tanpa alokasi** - Routing yang sangat efisien memori tanpa alokasi heap
- **Performa tinggi** - Benchmark menunjukkan kecepatan superior dibandingkan framework web Go lainnya
- **Dukungan middleware** - Sistem middleware yang dapat diperluas untuk autentikasi, logging, CORS, dll.
- **Bebas crash** - Middleware recovery bawaan mencegah panic meruntuhkan server Anda
- **Validasi JSON** - Binding dan validasi JSON request/response otomatis
- **Pengelompokan rute** - Organisasikan rute terkait dan terapkan middleware umum
- **Manajemen error** - Penanganan error dan logging terpusat
- **Rendering bawaan** - Dukungan untuk JSON, XML, template HTML, dan lainnya
- **Dapat diperluas** - Ekosistem besar middleware dan plugin komunitas

## Memulai

### Prasyarat

- **Versi Go**: Gin membutuhkan [Go](https://go.dev/) versi [1.25](https://go.dev/doc/devel/release#go1.25) atau lebih baru
- **Pengetahuan dasar Go**: Pemahaman tentang sintaks Go dan manajemen paket akan membantu

### Instalasi

Dengan [dukungan modul Go](https://go.dev/wiki/Modules#how-to-use-modules), cukup impor Gin dalam kode Anda dan Go akan mengunduhnya secara otomatis saat build:

```go
import "github.com/gin-gonic/gin"
```

### Aplikasi Gin Pertama Anda

Berikut contoh lengkap yang mendemonstrasikan kesederhanaan Gin:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a Gin router with default middleware (logger and recovery)
  r := gin.Default()

  // Define a simple GET endpoint
  r.GET("/ping", func(c *gin.Context) {
    // Return JSON response
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })

  // Start server on port 8080 (default)
  // Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
  r.Run()
}
```

**Menjalankan aplikasi:**

1. Simpan kode di atas sebagai `main.go`
2. Jalankan aplikasi:

   ```sh
   go run main.go
   ```

3. Buka browser Anda dan kunjungi [`http://localhost:8080/ping`](http://localhost:8080/ping)
4. Anda akan melihat: `{"message":"pong"}`

**Apa yang ditunjukkan contoh ini:**

- Membuat router Gin dengan middleware bawaan
- Mendefinisikan endpoint HTTP dengan fungsi handler sederhana
- Mengembalikan respons JSON
- Menjalankan server HTTP

### Langkah Selanjutnya

Setelah menjalankan aplikasi Gin pertama Anda, jelajahi sumber daya berikut untuk belajar lebih lanjut:

#### Sumber Belajar

- **[Panduan Memulai Cepat Gin](./quickstart/)** - Tutorial komprehensif dengan contoh API dan konfigurasi build
- **[Repositori Contoh](https://github.com/gin-gonic/examples)** - Contoh siap pakai yang mendemonstrasikan berbagai kasus penggunaan Gin:
  - Pengembangan REST API
  - Autentikasi & middleware
  - Upload dan unduh file
  - Koneksi WebSocket
  - Rendering template

### Tutorial Resmi

- [Tutorial Go.dev: Mengembangkan RESTful API dengan Go dan Gin](https://go.dev/doc/tutorial/web-service-gin)

## Ekosistem Middleware

Gin memiliki ekosistem middleware yang kaya untuk kebutuhan pengembangan web umum. Jelajahi middleware kontribusi komunitas:

- **[gin-contrib](https://github.com/gin-contrib)** - Koleksi middleware resmi termasuk:
  - Autentikasi (JWT, Basic Auth, Sessions)
  - CORS, Rate limiting, Kompresi
  - Logging, Metrics, Tracing
  - Penyajian file statis, Mesin template

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - Middleware komunitas tambahan
