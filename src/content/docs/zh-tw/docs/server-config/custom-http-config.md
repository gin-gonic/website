---
title: "自訂 HTTP 配置"
sidebar:
  order: 1
---

預設情況下，`router.Run()` 會啟動一個基本的 HTTP 伺服器。在生產環境中，你可能需要自訂逾時、標頭限制或 TLS 設定。你可以透過建立自己的 `http.Server` 並將 Gin 路由器作為 `Handler` 傳入來實現。

## 基本用法

將 Gin 路由器直接傳給 `http.ListenAndServe`：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  http.ListenAndServe(":8080", router)
}
```

## 使用自訂伺服器設定

建立一個 `http.Server` 結構體來配置讀取/寫入逾時和其他選項：

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

## 測試

```sh
curl http://localhost:8080/ping
# Output: pong
```

## 另請參閱

- [優雅重啟或停止](/zh-tw/docs/server-config/graceful-restart-or-stop/)
- [執行多個服務](/zh-tw/docs/server-config/run-multiple-service/)
