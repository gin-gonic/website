---
title: "Bind nilai default untuk field form"
sidebar:
  order: 5
---

Terkadang Anda ingin sebuah field kembali ke nilai default ketika klien tidak mengirim nilai. Binding form Gin mendukung default melalui opsi `default` dalam tag struct `form`. Ini bekerja untuk skalar dan, mulai Gin v1.11, untuk koleksi (slice/array) dengan format koleksi eksplisit.

Poin penting:

- Letakkan default tepat setelah kunci form: `form:"name,default=William"`.
- Untuk koleksi, tentukan cara memisahkan nilai dengan `collection_format:"multi|csv|ssv|tsv|pipes"`.
- Untuk `multi` dan `csv`, gunakan titik koma dalam default untuk memisahkan nilai (mis., `default=1;2;3`). Gin mengonversinya ke koma secara internal agar parser tag tetap tidak ambigu.
- Untuk `ssv` (spasi), `tsv` (tab), dan `pipes` (|), gunakan pemisah alami dalam default.

Contoh:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: use ; in defaults
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // infers binder by Content-Type
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

Jika Anda POST tanpa body apapun, Gin merespons dengan nilai default:

```sh
curl -X POST http://localhost:8080/person
```

Respons (contoh):

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

Catatan dan peringatan:

- Koma digunakan oleh sintaks tag struct Go untuk memisahkan opsi; hindari koma di dalam nilai default.
- Untuk `multi` dan `csv`, titik koma memisahkan nilai default; jangan sertakan titik koma di dalam default individual untuk format ini.
- Nilai `collection_format` yang tidak valid akan menghasilkan error binding.

Perubahan terkait:

- Format koleksi untuk binding form (`multi`, `csv`, `ssv`, `tsv`, `pipes`) ditingkatkan sekitar v1.11.
- Nilai default untuk koleksi ditambahkan di v1.11 (PR #4048).
