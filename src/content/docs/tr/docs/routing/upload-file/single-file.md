---
title: "Tekli dosya"
sidebar:
  order: 1
---

Bir `multipart/form-data` isteğinden tek bir yüklenen dosyayı almak için `c.FormFile` kullanın, ardından diske kaydetmek için `c.SaveUploadedFile` kullanın.

`router.MaxMultipartMemory` ayarını yaparak multipart ayrıştırma sırasında kullanılan maksimum belleği kontrol edebilirsiniz (varsayılan 32 MiB). Bu limitten büyük dosyalar bellekte değil diskteki geçici dosyalarda saklanır.

```go
package main

import (
  "fmt"
  "log"
  "net/http"
  "path/filepath"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Set a lower memory limit for multipart forms (default is 32 MiB)
  router.MaxMultipartMemory = 8 << 20 // 8 MiB

  router.POST("/upload", func(c *gin.Context) {
    // single file
    file, err := c.FormFile("file")
    if err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    log.Println(file.Filename)

    // Upload the file to specific dst.
    dst := filepath.Join("./files/", filepath.Base(file.Filename))
    c.SaveUploadedFile(file, dst)

    c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
  })

  router.Run(":8080")
}
```

## Test et

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
İstemciden gelen `file.Filename`'e asla güvenmeyin. Dosya yollarında kullanmadan önce her zaman dosya adını temizleyin. Dizin bileşenlerini çıkarmak ve yol geçişi saldırılarını önlemek için `filepath.Base` kullanın.
:::

## Ayrıca bakınız

- [Çoklu dosya](/tr/docs/routing/upload-file/multiple-file/)
- [Yükleme boyutunu sınırlama](/tr/docs/routing/upload-file/limit-bytes/)
