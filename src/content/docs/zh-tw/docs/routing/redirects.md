---
title: "重新導向"
sidebar:
  order: 9
---

Gin 支援 HTTP 重新導向（將客戶端傳送到不同的 URL）和路由器重新導向（在伺服器內部將請求轉發到不同的處理器，而無需客戶端的往返）。

## HTTP 重新導向

使用 `c.Redirect` 搭配適當的 HTTP 狀態碼來重新導向客戶端：

- **301（`http.StatusMovedPermanently`）** —— 資源已永久移動。瀏覽器和搜尋引擎會更新其快取。
- **302（`http.StatusFound`）** —— 暫時重新導向。瀏覽器會跟隨但不會快取新的 URL。
- **307（`http.StatusTemporaryRedirect`）** —— 類似 302，但瀏覽器必須保留原始的 HTTP 方法（適用於 POST 重新導向）。
- **308（`http.StatusPermanentRedirect`）** —— 類似 301，但瀏覽器必須保留原始的 HTTP 方法。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // External redirect (GET)
  router.GET("/old", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "https://www.google.com/")
  })

  // Redirect from POST -- use 302 or 307 to preserve behavior
  router.POST("/submit", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/result")
  })

  // Internal router redirect (no HTTP round-trip)
  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/final"
    router.HandleContext(c)
  })

  router.GET("/final", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.GET("/result", func(c *gin.Context) {
    c.String(http.StatusOK, "Redirected here!")
  })

  router.Run(":8080")
}
```

## 測試

```sh
# GET redirect -- follows to Google (use -L to follow, -I to see headers only)
curl -I http://localhost:8080/old
# Output includes: HTTP/1.1 301 Moved Permanently
# Output includes: Location: https://www.google.com/

# POST redirect -- returns 302 with new location
curl -X POST -I http://localhost:8080/submit
# Output includes: HTTP/1.1 302 Found
# Output includes: Location: /result

# Internal redirect -- handled server-side, client sees final response
curl http://localhost:8080/test
# Output: {"hello":"world"}
```

:::caution
從 POST 處理器重新導向時，請使用 `302` 或 `307` 而非 `301`。`301` 重新導向可能會導致某些瀏覽器將方法從 POST 改為 GET，這可能產生非預期的行為。
:::

:::tip
透過 `router.HandleContext(c)` 進行的內部重新導向不會向客戶端傳送重新導向回應。請求在伺服器內部重新路由，速度更快且對客戶端透明。
:::

## 另請參閱

- [路由分組](/zh-tw/docs/routing/grouping-routes/)
