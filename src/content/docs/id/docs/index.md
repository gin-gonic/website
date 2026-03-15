---
title: "Dokumentasi"
sidebar:
  order: 20
---

Gin adalah framework web HTTP berperforma tinggi yang ditulis dalam [Go](https://go.dev/). Gin menyediakan API mirip Martini tetapi dengan performa yang jauh lebih baik—hingga 40 kali lebih cepat—berkat [httprouter](https://github.com/julienschmidt/httprouter). Gin dirancang untuk membangun REST API, aplikasi web, dan microservice ketika kecepatan dan produktivitas pengembang adalah esensial.

**Mengapa memilih Gin?**

Gin menggabungkan kesederhanaan routing bergaya Express.js dengan karakteristik performa Go, menjadikannya ideal untuk:

- Membangun REST API dengan throughput tinggi
- Mengembangkan microservice yang perlu menangani banyak permintaan bersamaan
- Membuat aplikasi web yang membutuhkan waktu respons cepat
- Membuat prototipe layanan web secara cepat dengan boilerplate minimal

**Fitur utama Gin:**

- **Router tanpa alokasi** - Routing yang sangat efisien memori tanpa alokasi heap
- **Performa tinggi** - Benchmark menunjukkan kecepatan superior dibandingkan framework web Go lainnya
- **Dukungan middleware** - Sistem middleware yang dapat diperluas untuk autentikasi, logging, CORS, dll.
- **Bebas crash** - Middleware recovery bawaan mencegah panic agar server tidak crash
- **Validasi JSON** - Binding dan validasi JSON request/response otomatis
- **Pengelompokan rute** - Atur rute terkait dan terapkan middleware umum
- **Manajemen eror** - Penanganan eror dan logging terpusat
- **Rendering bawaan** - Dukungan untuk JSON, XML, templat HTML, dan lainnya
- **Dapat diekspansi** - Ekosistem besar middleware dan plugin komunitas

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
  // Buat router Gin dengan middleware bawaan (logger dan recovery)
  r := gin.Default()

  // Definisikan sebuah endpoint GET sederhana
  r.GET("/ping", func(c *gin.Context) {
    // Kembalikan respons JSON
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })

  // Jalankan server pada port 8080 (bawaan)
  // Server akan berjalan di 0.0.0.0:8080 (localhost:8080 di Windows)
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
  - Rendering templat

### Tutorial Resmi

- [Tutorial Go.dev: Mengembangkan RESTful API dengan Go dan Gin](https://go.dev/doc/tutorial/web-service-gin)

## Ekosistem Middleware

Gin memiliki ekosistem middleware yang kaya untuk kebutuhan pengembangan web umum. Jelajahi middleware kontribusi komunitas:

- **[gin-contrib](https://github.com/gin-contrib)** - Koleksi middleware resmi termasuk:
  - Autentikasi (JWT, Basic Auth, Sessions)
  - CORS, Rate limiting, Kompresi
  - Logging, Metrics, Tracing
  - Penyajian file statis, Mesin templat

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - Middleware komunitas tambahan
