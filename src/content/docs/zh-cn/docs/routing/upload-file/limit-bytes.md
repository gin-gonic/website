---
title: "限制上传大小"
sidebar:
  order: 3
---

使用 `http.MaxBytesReader` 严格限制上传文件的最大大小。当超出限制时，读取器会返回错误，你可以使用 `413 Request Entity Too Large` 状态码进行响应。

这对于防止客户端发送超大文件以耗尽服务器内存或磁盘空间的拒绝服务攻击非常重要。

## 工作原理

1. **定义限制** —— 常量 `MaxUploadSize`（1 MB）设置上传的硬性上限。
2. **强制限制** —— `http.MaxBytesReader` 包装 `c.Request.Body`。如果客户端发送的字节数超过允许值，读取器将停止并返回错误。
3. **解析并检查** —— `c.Request.ParseMultipartForm` 触发读取。代码检查 `*http.MaxBytesError` 以返回带有明确消息的 `413` 状态码。

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

## 测试

```sh
# Upload a small file (under 1 MB) -- succeeds
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/small-file.txt"
# Output: {"message":"upload successful"}

# Upload a large file (over 1 MB) -- rejected
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/large-file.zip"
# Output: {"error":"file too large (max: 1048576 bytes)"}
```

## 另请参阅

- [单文件](/zh-cn/docs/routing/upload-file/single-file/)
- [多文件](/zh-cn/docs/routing/upload-file/multiple-file/)
