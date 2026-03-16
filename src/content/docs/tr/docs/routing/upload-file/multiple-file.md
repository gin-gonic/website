---
title: "Çoklu dosya"
sidebar:
  order: 2
---

Tek bir istekte yüklenen birden fazla dosyayı almak için `c.MultipartForm` kullanın. Dosyalar form alan adına göre gruplandırılır — birlikte yüklemek istediğiniz tüm dosyalar için aynı alan adını kullanın.

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
    // Multipart form
    form, err := c.MultipartForm()
    if err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    files := form.File["files"]

    for _, file := range files {
      log.Println(file.Filename)

      // Upload the file to specific dst.
      dst := filepath.Join("./files/", filepath.Base(file.Filename))
      c.SaveUploadedFile(file, dst)
    }
    c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
  })

  router.Run(":8080")
}
```

## Test et

```sh
curl -X POST http://localhost:8080/upload \
  -F "files=@/path/to/test1.zip" \
  -F "files=@/path/to/test2.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 2 files uploaded!
```

## Ayrıca bakınız

- [Tekli dosya](/tr/docs/routing/upload-file/single-file/)
- [Yükleme boyutunu sınırlama](/tr/docs/routing/upload-file/limit-bytes/)
