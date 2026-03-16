---
title: "File tunggal"
sidebar:
  order: 1
---

Gunakan `c.FormFile` untuk menerima satu file yang diupload dari request `multipart/form-data`, kemudian `c.SaveUploadedFile` untuk menyimpannya ke disk.

Anda dapat mengontrol memori maksimum yang digunakan selama parsing multipart dengan mengatur `router.MaxMultipartMemory` (default adalah 32 MiB). File yang lebih besar dari batas ini disimpan di file sementara pada disk alih-alih di memori.

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

## Uji coba

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
Jangan pernah mempercayai `file.Filename` dari klien. Selalu sanitasi nama file sebelum menggunakannya di path file. Gunakan `filepath.Base` untuk menghapus komponen direktori dan mencegah serangan path traversal.
:::

## Lihat juga

- [Banyak file](/id/docs/routing/upload-file/multiple-file/)
- [Batasi ukuran upload](/id/docs/routing/upload-file/limit-bytes/)
