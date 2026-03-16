---
title: "多個檔案"
sidebar:
  order: 2
---

使用 `c.MultipartForm` 在單一請求中接收多個上傳的檔案。檔案按表單欄位名稱分組——對所有要一起上傳的檔案使用相同的欄位名稱。

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

## 測試

```sh
curl -X POST http://localhost:8080/upload \
  -F "files=@/path/to/test1.zip" \
  -F "files=@/path/to/test2.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 2 files uploaded!
```

## 另請參閱

- [單一檔案](/zh-tw/docs/routing/upload-file/single-file/)
- [限制上傳大小](/zh-tw/docs/routing/upload-file/limit-bytes/)
