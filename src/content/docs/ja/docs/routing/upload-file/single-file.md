---
title: "単一ファイル"
sidebar:
  order: 1
---

`c.FormFile` を使用して `multipart/form-data` リクエストから単一のアップロードファイルを受け取り、`c.SaveUploadedFile` でディスクに保存します。

`router.MaxMultipartMemory` を設定することで、マルチパート解析中に使用される最大メモリを制御できます（デフォルトは32 MiB）。この制限を超えるファイルは、メモリではなくディスク上の一時ファイルに保存されます。

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

## テスト

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
クライアントからの `file.Filename` を信頼しないでください。ファイルパスで使用する前に必ずファイル名をサニタイズしてください。`filepath.Base` を使用してディレクトリコンポーネントを除去し、パストラバーサル攻撃を防いでください。
:::

## 関連項目

- [複数ファイル](/ja/docs/routing/upload-file/multiple-file/)
- [アップロードサイズの制限](/ja/docs/routing/upload-file/limit-bytes/)
