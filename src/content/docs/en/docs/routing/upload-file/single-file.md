---
title: "Single file"
sidebar:
  order: 1
---

Use `c.FormFile` to receive a single uploaded file from a `multipart/form-data` request, then `c.SaveUploadedFile` to save it to disk.

You can control the maximum memory used during multipart parsing by setting `router.MaxMultipartMemory` (default is 32 MiB). Files larger than this limit are stored in temporary files on disk instead of memory.

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

## Test it

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
Never trust `file.Filename` from the client. Always sanitize the filename before using it in file paths. Use `filepath.Base` to strip directory components and prevent path traversal attacks.
:::

## See also

- [Multiple files](/en/docs/routing/upload-file/multiple-file/)
- [Limit upload size](/en/docs/routing/upload-file/limit-bytes/)
