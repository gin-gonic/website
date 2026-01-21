---
title: "🍳 Resep Gin (Buku Masak)"
sidebar:
  order: 6
---

## Pengenalan

Bagian ini menunjukkan **cara menggunakan Gin dalam kode Anda** melalui resep-resep kecil yang praktis.
Setiap resep berfokus pada **satu konsep** sehingga Anda dapat belajar dengan cepat dan menerapkannya segera.

Gunakan contoh-contoh ini sebagai referensi untuk menyusun API dunia nyata menggunakan Gin.

---

## 🧭 Apa yang akan Anda pelajari

Di bagian ini, Anda akan menemukan contoh-contoh yang mencakup:

- **Dasar-dasar Server**: Menjalankan server, routing, dan konfigurasi.
- **Penanganan Request**: Binding data JSON, XML, dan form.
- **Middleware**: Menggunakan middleware bawaan dan kustom.
- **Rendering**: Menyajikan HTML, JSON, XML, dan lainnya.
- **Keamanan**: Menangani SSL, header, dan autentikasi.

---

## 🥇 Resep 1: Server Gin Minimal

**Tujuan:** Memulai server Gin dan menangani request dasar.

### Langkah-langkah

1. Buat router
2. Definisikan route
3. Jalankan server

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  r := gin.Default()

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run(":8080") // http://localhost:8080
}
```
