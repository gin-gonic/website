---
title: "Batasi ukuran unggahan"
sidebar:
  order: 3
---

Gunakan `http.MaxBytesReader` untuk membatasi secara ketat ukuran maksimum file yang diunggah. Ketika batas terlampaui, reader mengembalikan eror dan Anda dapat merespons dengan status `413 Request Entity Too Large`.

Ini penting untuk mencegah serangan *denial-of-service* ketika klien mengirim file berukuran sangat besar untuk menghabiskan memori atau ruang disk server.

## Cara kerja

1. **Tentukan batas** — Konstanta `MaxUploadSize` (1 MB) menetapkan batas mutlak untuk unggahan.
2. **Terapkan batas** — `http.MaxBytesReader` membungkus `c.Request.Body`. Jika klien mengirim lebih banyak byte dari yang diizinkan, reader berhenti dan mengembalikan eror.
3. **Parse dan periksa** — `c.Request.ParseMultipartForm` memicu pembacaan. Kode memeriksa `*http.MaxBytesError` untuk mengembalikan status `413` dengan pesan yang jelas.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

const (
  MaxUploadSize = 1 << 20 // 1 MB
)

func uploadHandler(c *gin.Context) {
  // Bungkus body reader sehingga hanya MaxUploadSize byte yang diizinkan
  c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxUploadSize)

  // Parse form multipart
  if err := c.Request.ParseMultipartForm(MaxUploadSize); err != nil {
    if _, ok := err.(*http.MaxBytesError); ok {
      c.JSON(http.StatusRequestEntityTooLarge, gin.H{
        "error": fmt.Sprintf("file too large (max: %d bytes)", MaxUploadSize),
      })
      return
    }
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  file, _, err := c.Request.FormFile("file")
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "file form required"})
    return
  }
  defer file.Close()

  c.JSON(http.StatusOK, gin.H{
    "message": "upload successful",
  })
}

func main() {
  r := gin.Default()
  r.POST("/upload", uploadHandler)
  r.Run(":8080")
}
```

## Uji coba

```sh
# Unggah file kecil (di bawah 1 MB) -- berhasil
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/small-file.txt"
# Output: {"message":"upload successful"}

# Unggah file besar (di atas 1 MB) -- ditolak
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/large-file.zip"
# Output: {"error":"file too large (max: 1048576 bytes)"}
```

## Lihat juga

- [File tunggal](/id/docs/routing/upload-file/single-file/)
- [Multipel file](/id/docs/routing/upload-file/multiple-file/)
