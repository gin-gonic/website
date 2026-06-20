---
title: "提供靜態檔案"
sidebar:
  order: 6
---

Gin 提供三種方法來提供靜態內容：

- **`router.Static(relativePath, root)`** — 提供整個目錄。對 `relativePath` 的請求會映射到 `root` 下的檔案。例如，`router.Static("/assets", "./assets")` 會在 `/assets/style.css` 提供 `./assets/style.css`。
- **`router.StaticFS(relativePath, fs)`** — 與 `Static` 類似，但接受 `http.FileSystem` 介面，讓你能更好地控制檔案的解析方式。當你需要從嵌入式檔案系統提供檔案或想要自訂目錄列表行為時使用此方法。
- **`router.StaticFile(relativePath, filePath)`** — 提供單一檔案。適用於 `/favicon.ico` 或 `/robots.txt` 等端點。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::caution[安全性：路徑穿越]
你傳給 `Static()` 或 `http.Dir()` 的目錄將對所有客戶端完全開放存取。確保它不包含敏感檔案，如配置檔案、`.env` 檔案、私鑰或資料庫檔案。

最佳做法：

- 使用專用目錄，僅包含你打算公開提供的檔案。
- 避免傳遞如 `"."` 或 `"/"` 的路徑，這可能暴露你的整個專案或檔案系統。
- 如果你需要更精細的控制（例如，停用目錄列表），請使用 `StaticFS` 搭配自訂的 `http.FileSystem` 實作。標準的 `http.Dir` 預設啟用目錄列表。
:::
