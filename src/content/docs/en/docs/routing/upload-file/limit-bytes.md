---
title: "Limit upload size"
sidebar:
  order: 3
---

This example shows how to use `http.MaxBytesReader` to strictly limit the maximum size of uploaded files and return a `413` status when the limit is exceeded.

See the detail [example code](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go).

## How it works

1. **Define limit** -- A constant `MaxUploadSize` (1 MB) sets the hard cap for uploads.
2. **Enforce limit** -- `http.MaxBytesReader` wraps `c.Request.Body`. If the client sends more bytes than allowed, the reader stops and returns an error.
3. **Parse and check** -- `c.Request.ParseMultipartForm` triggers the read. The code checks for `*http.MaxBytesError` to return a `413 Request Entity Too Large` status with a clear message.

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

How to `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
