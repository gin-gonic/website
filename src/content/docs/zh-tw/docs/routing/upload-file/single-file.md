---
title: "單一檔案"
sidebar:
  order: 1
---

使用 `c.FormFile` 從 `multipart/form-data` 請求中接收單一上傳的檔案，然後使用 `c.SaveUploadedFile` 將其儲存到磁碟。

你可以透過設定 `router.MaxMultipartMemory`（預設為 32 MiB）來控制多部分解析時使用的最大記憶體。超過此限制的檔案會儲存在磁碟上的暫存檔案中，而非記憶體中。

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

## 測試

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
絕對不要信任來自客戶端的 `file.Filename`。在檔案路徑中使用之前，務必清理檔名。使用 `filepath.Base` 來去除目錄組件，防止路徑遍歷攻擊。
:::

## 另請參閱

- [多個檔案](/zh-tw/docs/routing/upload-file/multiple-file/)
- [限制上傳大小](/zh-tw/docs/routing/upload-file/limit-bytes/)
