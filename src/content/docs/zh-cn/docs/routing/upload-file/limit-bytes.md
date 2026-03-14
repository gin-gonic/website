---
title: "限制上传大小"
sidebar:
  order: 3
---

本示例展示如何使用 `http.MaxBytesReader` 严格限制上传文件的最大大小，并在超出限制时返回 `413` 状态码。

查看详细[示例代码](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go)。

## 工作原理

1. **定义限制** -- 常量 `MaxUploadSize`（1 MB）设置上传的硬性上限。
2. **强制限制** -- `http.MaxBytesReader` 包装 `c.Request.Body`。如果客户端发送的字节数超过允许值，读取器将停止并返回错误。
3. **解析并检查** -- `c.Request.ParseMultipartForm` 触发读取。代码检查 `*http.MaxBytesError` 以返回 `413 Request Entity Too Large` 状态码和明确的消息。

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

如何使用 `curl`：

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
