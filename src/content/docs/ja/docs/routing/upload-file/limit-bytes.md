---
title: "アップロードサイズの制限"
sidebar:
  order: 3
---

この例では、`http.MaxBytesReader`を使用してアップロードファイルの最大サイズを厳密に制限し、制限を超えた場合に`413`ステータスを返す方法を示します。

詳細は[サンプルコード](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go)を参照してください。

## 動作の仕組み

1. **制限の定義** -- 定数`MaxUploadSize`（1 MB）がアップロードのハードキャップを設定します。
2. **制限の適用** -- `http.MaxBytesReader`が`c.Request.Body`をラップします。クライアントが許可されたバイト数を超えて送信した場合、リーダーは停止してエラーを返します。
3. **パースとチェック** -- `c.Request.ParseMultipartForm`が読み取りをトリガーします。コードは`*http.MaxBytesError`をチェックして、明確なメッセージとともに`413 Request Entity Too Large`ステータスを返します。

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
  // MaxUploadSizeバイトのみ許可するようにボディリーダーをラップ
  c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxUploadSize)

  // Multipartフォームをパース
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

`curl`の使い方：

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
