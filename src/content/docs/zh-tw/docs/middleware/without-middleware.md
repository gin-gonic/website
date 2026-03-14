---
title: "預設不帶中介軟體"
sidebar:
  order: 1
---

Gin 提供兩種方式建立路由引擎，差別在於預設附加了哪些中介軟體。

### `gin.Default()` -- 附帶 Logger 和 Recovery

`gin.Default()` 建立一個已附加兩個中介軟體的路由器：

- **Logger** -- 將請求日誌寫入標準輸出（方法、路徑、狀態碼、延遲時間）。
- **Recovery** -- 從處理函式中的任何 panic 恢復並回傳 500 回應，防止伺服器崩潰。

這是快速入門最常見的選擇。

### `gin.New()` -- 空白引擎

`gin.New()` 建立一個完全空白的路由器，**不附加任何中介軟體**。當你想要完全控制執行哪些中介軟體時很有用，例如：

- 你想使用結構化日誌記錄器（如 `slog` 或 `zerolog`）取代預設的文字日誌記錄器。
- 你想自訂 panic 恢復行為。
- 你正在建構微服務，需要最小化或專用的中介軟體堆疊。

### 範例

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a blank engine with no middleware.
  r := gin.New()

  // Attach only the middleware you need.
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  log.Fatal(r.Run(":8080"))
}
```

在上面的範例中，包含了 Recovery 中介軟體以防止崩潰，但省略了預設的 Logger 中介軟體。你可以用自己的日誌記錄中介軟體替換它，或完全不使用。
