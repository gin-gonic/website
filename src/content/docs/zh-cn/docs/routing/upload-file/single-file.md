---
title: "单文件"
sidebar:
  order: 1
---

使用 `c.FormFile` 从 `multipart/form-data` 请求中接收单个上传的文件，然后使用 `c.SaveUploadedFile` 将其保存到磁盘。

你可以通过设置 `router.MaxMultipartMemory` 来控制 multipart 解析期间使用的最大内存（默认为 32 MiB）。超过此限制的文件将存储在磁盘上的临时文件中而不是内存中。

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

## 测试

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
永远不要信任客户端提供的 `file.Filename`。在文件路径中使用之前，始终对文件名进行清理。使用 `filepath.Base` 去除目录组件以防止路径遍历攻击。
:::

## 另请参阅

- [多文件](/zh-cn/docs/routing/upload-file/multiple-file/)
- [限制上传大小](/zh-cn/docs/routing/upload-file/limit-bytes/)
