---
title: "從 reader 提供資料"
sidebar:
  order: 8
---

`DataFromReader` 讓你可以從任何 `io.Reader` 直接將資料串流到 HTTP 回應，而不需要先將整個內容緩衝在記憶體中。這對於建構代理端點或高效地從遠端來源提供大型檔案至關重要。

**常見使用情境：**

- **代理遠端資源** — 從外部服務（如雲端儲存 API 或 CDN）擷取檔案並轉發給客戶端。資料通過你的伺服器流動，而不會完全載入到記憶體中。
- **提供生成的內容** — 在資料產生時串流動態生成的資料（如 CSV 匯出或報告檔案）。
- **大型檔案下載** — 提供太大而無法放在記憶體中的檔案，透過從磁碟或遠端來源分塊讀取。

方法簽名為 `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)`。你需要提供 HTTP 狀態碼、內容長度（讓客戶端知道總大小）、MIME 類型、要串流的 `io.Reader`，以及可選的額外回應標頭映射（如用於檔案下載的 `Content-Disposition`）。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/someDataFromReader", func(c *gin.Context) {
    response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
    if err != nil || response.StatusCode != http.StatusOK {
      c.Status(http.StatusServiceUnavailable)
      return
    }

    reader := response.Body
    contentLength := response.ContentLength
    contentType := response.Header.Get("Content-Type")

    extraHeaders := map[string]string{
      "Content-Disposition": `attachment; filename="gopher.png"`,
    }

    c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
  })
  router.Run(":8080")
}
```

在此範例中，Gin 從 GitHub 擷取圖片並直接將其串流到客戶端作為可下載的附件。圖片位元組從上游 HTTP 回應主體流向客戶端回應，而不會累積在緩衝區中。注意 `response.Body` 會在處理函式返回後由 HTTP 伺服器自動關閉，因為 `DataFromReader` 在回應寫入過程中會完整讀取它。
