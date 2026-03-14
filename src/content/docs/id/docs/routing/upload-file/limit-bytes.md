---
title: "Batasi ukuran upload"
sidebar:
  order: 3
---

Contoh ini menunjukkan cara menggunakan `http.MaxBytesReader` untuk membatasi secara ketat ukuran maksimum file yang diupload dan mengembalikan status `413` ketika batas terlampaui.

Lihat detail [contoh kode](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go).

## Cara kerjanya

1. **Tentukan batas** -- Konstanta `MaxUploadSize` (1 MB) menetapkan batas keras untuk upload.
2. **Terapkan batas** -- `http.MaxBytesReader` membungkus `c.Request.Body`. Jika klien mengirim lebih banyak byte dari yang diizinkan, reader berhenti dan mengembalikan error.
3. **Parse dan periksa** -- `c.Request.ParseMultipartForm` memicu pembacaan. Kode memeriksa `*http.MaxBytesError` untuk mengembalikan status `413 Request Entity Too Large` dengan pesan yang jelas.

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
  // Wrap the body reader so only MaxUploadSize bytes are allowed
  c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxUploadSize)

  // Parse multipart form
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

Cara menggunakan `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
