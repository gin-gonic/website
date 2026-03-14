---
title: "Yükleme boyutunu sınırlama"
sidebar:
  order: 3
---

Bu örnek, yüklenen dosyaların maksimum boyutunu kesin olarak sınırlamak ve limit aşıldığında `413` durumu döndürmek için `http.MaxBytesReader`'ın nasıl kullanılacağını gösterir.

Ayrıntılı [örnek koda](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go) bakın.

## Nasıl çalışır

1. **Limit tanımlama** -- `MaxUploadSize` sabiti (1 MB) yüklemeler için kesin üst sınırı belirler.
2. **Limiti uygulama** -- `http.MaxBytesReader`, `c.Request.Body`'yi sarar. İstemci izin verilenden fazla bayt gönderirse, okuyucu durur ve hata döndürür.
3. **Ayrıştırma ve kontrol** -- `c.Request.ParseMultipartForm` okumayı tetikler. Kod, net bir mesajla `413 Request Entity Too Large` durumu döndürmek için `*http.MaxBytesError`'u kontrol eder.

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

`curl` ile nasıl kullanılır:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
