---
title: "Memulai Cepat"
sidebar:
  order: 2
---

Selamat datang di panduan memulai cepat Gin! Panduan ini memandu Anda dalam menginstal Gin, menyiapkan proyek, dan menjalankan API pertama Anda—sehingga Anda dapat mulai membangun layanan web dengan percaya diri.

## Prasyarat

- **Versi Go**: Gin membutuhkan [Go](https://go.dev/) versi [1.25](https://go.dev/doc/devel/release#go1.25) atau lebih baru
- Pastikan Go ada di `PATH` Anda dan dapat digunakan dari terminal. Untuk bantuan instalasi Go, [lihat dokumentasi resmi](https://go.dev/doc/install).

---

## Langkah 1: Instal Gin dan Inisialisasi Proyek Anda

Mulai dengan membuat folder proyek baru dan menginisialisasi modul Go:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Tambahkan Gin sebagai dependensi:

```sh
go get -u github.com/gin-gonic/gin
```

---

## Langkah 2: Buat Aplikasi Gin Pertama Anda

Buat file bernama `main.go`:

```sh
touch main.go
```

Buka `main.go` dan tambahkan kode berikut:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })
  router.Run() // berjalan di 0.0.0.0:8080 secara bawaan
}
```

---

## Langkah 3: Jalankan Server API Anda

Jalankan server Anda dengan:

```sh
go run main.go
```

Buka [http://localhost:8080/ping](http://localhost:8080/ping) di browser Anda, dan Anda akan melihat:

```json
{"message":"pong"}
```

---

## Contoh Tambahan: Menggunakan net/http dengan Gin

Jika Anda ingin menggunakan konstanta `net/http` untuk kode respons, impor juga paket tersebut:

```go
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  router.Run()
}
```

---

## Tips & Sumber Daya

- Baru mengenal Go? Pelajari cara menulis dan menjalankan kode Go di [dokumentasi resmi Go](https://go.dev/doc/code).
- Ingin berlatih konsep Gin secara langsung? Lihat [Sumber Belajar](../learning-resources) kami untuk tantangan interaktif dan tutorial.
- Butuh contoh dengan fitur lengkap? Coba buat scaffold dengan:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- Untuk dokumentasi lebih detail, kunjungi [dokumentasi kode sumber Gin](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).
