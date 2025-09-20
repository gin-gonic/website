---
title: "Dokumentasi"
sidebar:
  order: 20
---

Gin adalah framework web HTTP berkinerja tinggi yang ditulis dalam [Go](https://go.dev/). Framework ini menawarkan API mirip Martini dengan performa jauh lebih baik—hingga 40 kali lebih cepat—berkat [httprouter](https://github.com/julienschmidt/httprouter). Gin dirancang untuk membangun API REST, aplikasi web, dan mikroservis dengan kebutuhan kecepatan dan produktivitas pengembang yang tinggi.

**Mengapa memilih Gin?**

Gin menggabungkan kesederhanaan routing gaya Express.js dengan performa Go, sehingga sangat ideal untuk:

- Membangun API REST dengan throughput tinggi
- Mengembangkan mikroservis yang menangani banyak permintaan bersamaan
- Membuat aplikasi web yang membutuhkan waktu respons cepat
- Prototipe layanan web dengan cepat dan konfigurasi minimal

**Fitur utama Gin:**

- **Router tanpa alokasi memori** – Routing sangat efisien tanpa alokasi heap
- **Performa tinggi** – Benchmark menunjukkan kecepatan superior dibanding framework web Go lain
- **Dukungan middleware** – Sistem middleware yang dapat diperluas untuk otentikasi, logging, CORS, dan lainnya
- **Tahan crash** – Middleware pemulihan bawaan mencegah crash dari panic
- **Validasi JSON** – Binding dan validasi otomatis untuk request/response JSON
- **Pengelompokan route** – Mengelompokkan route terkait dan menerapkan middleware bersama
- **Manajemen error** – Penanganan dan logging error terpusat
- **Render built-in** – Dukungan untuk JSON, XML, template HTML, dan lainnya
- **Extensible** – Ekosistem komunitas middleware dan plugin yang besar

## Memulai

### Prasyarat

- **Versi Go:** Gin memerlukan [Go](https://go.dev/) versi [1.23](https://go.dev/doc/devel/release#go1.23.0) atau di atasnya
- **Pengetahuan dasar Go:** Familiar dengan sintaksis Go dan manajemen paket akan membantu

### Instalasi

Dengan [dukungan modul Go](https://go.dev/wiki/Modules#how-to-use-modules), cukup impor Gin di kode Anda dan Go akan mengambilnya saat build:

```go
import "github.com/gin-gonic/gin"
```

### Aplikasi Gin Pertama Anda

Berikut contoh lengkap yang memperlihatkan kesederhanaan Gin:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Membuat router Gin dengan middleware default (logger dan recovery)
  r := gin.Default()
  
  // Definisikan endpoint GET sederhana
  r.GET("/ping", func(c *gin.Context) {
    // Kembalikan respons JSON
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  
  // Jalankan server pada port 8080 (default)
  // Server akan mendengarkan di 0.0.0.0:8080 (localhost:8080 di Windows)
  r.Run()
}
```

**Menjalankan aplikasi:**

1. Simpan kode di atas sebagai `main.go`
2. Jalankan aplikasi:

   ```sh
   go run main.go
   ```

3. Buka browser dan kunjungi [`http://localhost:8080/ping`](http://localhost:8080/ping)
4. Anda akan melihat: `{"message":"pong"}`

**Apa yang ditunjukkan contoh ini:**

- Membuat router Gin dengan middleware default
- Mendefinisikan endpoint HTTP dengan fungsi sederhana
- Mengembalikan respons JSON
- Memulai server HTTP

### Langkah Berikutnya

Setelah menjalankan aplikasi Gin pertama Anda, jelajahi sumber ini untuk mempelajari lebih banyak:

#### 📚 Sumber Pembelajaran

- **[Panduan Quick Start Gin](./quickstart/)** – Tutorial komprehensif dengan contoh API dan konfigurasi build
- **[Repositori Contoh](https://github.com/gin-gonic/examples)** – Contoh siap pakai untuk berbagai kasus penggunaan Gin:
  - Pengembangan API REST
  - Otentikasi & middleware
  - Upload dan download file
  - Koneksi WebSocket
  - Render template

### Tutorial Resmi

- [Tutorial Go.dev: Mengembangkan API RESTful dengan Go dan Gin](https://go.dev/doc/tutorial/web-service-gin)

## 🔌 Ekosistem Middleware

Gin memiliki ekosistem middleware yang kaya untuk kebutuhan pengembangan web umum. Telusuri middleware kontribusi komunitas:

- **[gin-contrib](https://github.com/gin-contrib)** – Koleksi middleware resmi termasuk:
  - Otentikasi (JWT, Basic Auth, Session)
  - CORS, pembatasan rate, kompresi
  - Logging, metrik, tracing
  - Serve file statis, engine template

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** – Middleware komunitas tambahan
