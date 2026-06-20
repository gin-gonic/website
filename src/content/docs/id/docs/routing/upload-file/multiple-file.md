---
title: "Multipel file"
sidebar:
  order: 2
---

Gunakan `c.MultipartForm` untuk menerima beberapa file yang diunggah dalam satu permintaan. File-file dikelompokkan berdasarkan nama field form — gunakan nama field yang sama untuk semua file yang ingin diunggah bersamaan.

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
  // Menurunkan batas memori untuk form multipart (bawaannya 32 MiB)
  router.MaxMultipartMemory = 8 << 20 // 8 MiB

  router.POST("/upload", func(c *gin.Context) {
    // Form multipart
    form, err := c.MultipartForm()
    if err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    files := form.File["files"]

    for _, file := range files {
      log.Println(file.Filename)

      // Unggah file ke tujuan tertentu.
      dst := filepath.Join("./files/", filepath.Base(file.Filename))
      c.SaveUploadedFile(file, dst)
    }
    c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
  })

  router.Run(":8080")
}
```

## Uji coba

```sh
curl -X POST http://localhost:8080/upload \
  -F "files=@/path/to/test1.zip" \
  -F "files=@/path/to/test2.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 2 files uploaded!
```

## Lihat juga

- [File tunggal](/id/docs/routing/upload-file/single-file/)
- [Batasi ukuran unggahan](/id/docs/routing/upload-file/limit-bytes/)
