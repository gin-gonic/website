---
title: "從檔案提供資料"
sidebar:
  order: 7
---

Gin 提供了多種方法將檔案提供給客戶端。每種方法適用於不同的使用情境：

- **`c.File(path)`** -- 從本地檔案系統提供檔案。內容類型會自動偵測。當你在編譯時知道確切的檔案路徑或已經驗證過路徑時使用此方法。
- **`c.FileFromFS(path, fs)`** -- 從 `http.FileSystem` 介面提供檔案。當從嵌入式檔案系統（`embed.FS`）、自訂儲存後端提供檔案，或想要限制存取特定目錄樹時很有用。
- **`c.FileAttachment(path, filename)`** -- 透過設定 `Content-Disposition: attachment` 標頭將檔案作為下載提供。瀏覽器會提示使用者使用你提供的檔名儲存檔案，而不管磁碟上的原始檔名。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Serve a file inline (displayed in browser)
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // Serve a file from an http.FileSystem
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // Serve a file as a downloadable attachment with a custom filename
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

你可以使用 curl 測試下載端點：

```sh
# The -v flag shows the Content-Disposition header
curl -v http://localhost:8080/download --output report.xlsx

# Serve a file inline
curl http://localhost:8080/local/file
```

要從 `io.Reader` 串流資料（如遠端 URL 或動態生成的內容），請改用 `c.DataFromReader()`。詳情請參閱[從 reader 提供資料](/zh-tw/docs/rendering/serving-data-from-reader/)。

:::caution[安全性：路徑穿越]
切勿將使用者輸入直接傳給 `c.File()` 或 `c.FileAttachment()`。攻擊者可以提供如 `../../etc/passwd` 的路徑來讀取伺服器上的任意檔案。請務必驗證和清理檔案路徑，或使用 `c.FileFromFS()` 搭配受限的 `http.FileSystem` 來限制存取特定目錄。

```go
// DANGEROUS -- never do this
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // attacker controls the path
})

// SAFE -- restrict to a specific directory
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::
