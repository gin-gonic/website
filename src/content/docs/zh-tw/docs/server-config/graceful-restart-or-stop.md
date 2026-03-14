---
title: "優雅地重啟或停止"
sidebar:
  order: 5
---

當伺服器程序收到終止信號時（例如在部署或擴展事件中），立即關閉會丟棄所有進行中的請求，導致客戶端收到中斷的連線和可能損壞的操作。**優雅關閉**透過以下方式解決此問題：

- **完成進行中的請求** -- 正在處理的請求會有時間完成，讓客戶端收到正確的回應，而不是連線重置。
- **排空連線** -- 伺服器停止接受新連線，同時允許現有連線完成，防止突然中斷。
- **清理資源** -- 開啟的資料庫連線、檔案控制代碼和背景工作程序會正確關閉，避免資料損壞或資源洩露。
- **實現零停機部署** -- 與負載均衡器結合使用時，優雅關閉讓你可以在不產生任何使用者可見錯誤的情況下發布新版本。

在 Go 中有幾種方式可以實現這一點。

我們可以使用 [fvbock/endless](https://github.com/fvbock/endless) 來取代預設的 `ListenAndServe`。參考 issue [#296](https://github.com/gin-gonic/gin/issues/296) 以獲取更多細節。

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

endless 的替代方案：

* [manners](https://github.com/braintree/manners)：一個禮貌的 Go HTTP 伺服器，能優雅地關閉。
* [graceful](https://github.com/tylerb/graceful)：Graceful 是一個讓 http.Handler 伺服器能優雅關閉的 Go 套件。
* [grace](https://github.com/facebookgo/grace)：Go 伺服器的優雅重啟和零停機部署。

如果你使用 Go 1.8 或更高版本，你可能不需要使用這些函式庫！考慮使用 `http.Server` 內建的 [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) 方法來實現優雅關閉。請參閱完整的 [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) 範例。

```go
//go:build go1.8
// +build go1.8

package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "Welcome Gin Server")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: router.Handler(),
  }

  go func() {
    // service connections
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()

  // Wait for interrupt signal to gracefully shutdown the server with
  // a timeout of 5 seconds.
  quit := make(chan os.Signal, 1)
  // kill (no params) by default sends syscall.SIGTERM
  // kill -2 is syscall.SIGINT
  // kill -9 is syscall.SIGKILL but can't be caught, so don't need add it
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Shutdown Server ...")

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  if err := srv.Shutdown(ctx); err != nil {
    log.Println("Server Shutdown:", err)
  }
  log.Println("Server exiting")
}
```
