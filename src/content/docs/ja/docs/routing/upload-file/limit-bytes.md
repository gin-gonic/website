---
title: "アップロードサイズの制限"
sidebar:
  order: 3
---

`http.MaxBytesReader` を使用して、アップロードファイルの最大サイズを厳密に制限します。制限を超えた場合、リーダーはエラーを返し、`413 Request Entity Too Large` ステータスで応答できます。

これは、クライアントが過度に大きなファイルを送信してサーバーのメモリやディスクスペースを消耗させるサービス拒否攻撃を防ぐために重要です。

## 仕組み

1. **制限の定義** -- 定数 `MaxUploadSize`（1 MB）がアップロードのハードキャップを設定します。
2. **制限の適用** -- `http.MaxBytesReader` が `c.Request.Body` をラップします。クライアントが許可されたバイト数を超えて送信した場合、リーダーは停止してエラーを返します。
3. **パースと確認** -- `c.Request.ParseMultipartForm` が読み取りをトリガーします。コードは `*http.MaxBytesError` を確認し、明確なメッセージと共に `413` ステータスを返します。

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

## テスト

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

## 関連項目

- [単一ファイル](/ja/docs/routing/upload-file/single-file/)
- [複数ファイル](/ja/docs/routing/upload-file/multiple-file/)
