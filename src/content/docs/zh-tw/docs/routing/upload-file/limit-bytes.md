---
title: "限制上傳大小"
sidebar:
  order: 3
---

使用 `http.MaxBytesReader` 嚴格限制上傳檔案的最大大小。當超出限制時，讀取器會回傳錯誤，你可以回應 `413 Request Entity Too Large` 狀態。

這對於防止阻斷服務攻擊非常重要，因為客戶端可能會傳送過大的檔案來耗盡伺服器記憶體或磁碟空間。

## 運作原理

1. **定義限制** —— 常數 `MaxUploadSize`（1 MB）設定上傳的硬性上限。
2. **強制限制** —— `http.MaxBytesReader` 包裝 `c.Request.Body`。如果客戶端傳送的位元組數超過允許的數量，讀取器會停止並回傳錯誤。
3. **解析並檢查** —— `c.Request.ParseMultipartForm` 觸發讀取。程式碼檢查 `*http.MaxBytesError` 以回傳 `413` 狀態碼及明確的訊息。

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

## 測試

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

## 另請參閱

- [單一檔案](/zh-tw/docs/routing/upload-file/single-file/)
- [多個檔案](/zh-tw/docs/routing/upload-file/multiple-file/)
