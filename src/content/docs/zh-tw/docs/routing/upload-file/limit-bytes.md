---
title: "限制上傳大小"
sidebar:
  order: 3
---

此範例展示如何使用 `http.MaxBytesReader` 嚴格限制上傳檔案的最大大小，並在超出限制時回傳 `413` 狀態碼。

請參閱詳細的[範例程式碼](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go)。

## 運作原理

1. **定義限制** -- 常數 `MaxUploadSize`（1 MB）設定上傳的硬性上限。
2. **強制限制** -- `http.MaxBytesReader` 包裝 `c.Request.Body`。如果客戶端傳送的位元組數超過允許的數量，讀取器會停止並回傳錯誤。
3. **解析並檢查** -- `c.Request.ParseMultipartForm` 觸發讀取。程式碼檢查 `*http.MaxBytesError` 以回傳 `413 Request Entity Too Large` 狀態碼及明確的訊息。

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

使用 `curl` 測試：

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
