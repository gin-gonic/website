---
title: "優雅地重新啟動或停止"
---

您想要優雅地重新啟動或停止您的網頁伺服器嗎？
有幾種方法可以做到。

我們可以使用 [fvbock/endless](https://github.com/fvbock/endless) 來取代預設的 `ListenAndServe`。詳情請參閱問題 [#296](https://github.com/gin-gonic/gin/issues/296)。

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

endless 的替代方案：

* [manners](https://github.com/braintree/manners)：一個能優雅關閉的 Go HTTP 伺服器。
* [graceful](https://github.com/tylerb/graceful)：Graceful 是一個 Go 套件，可讓 http.Handler 伺服器優雅關閉。
* [grace](https://github.com/facebookgo/grace)：Go 伺服器的優雅重啟與零停機部署。

如果您使用 Go 1.8 或更新版本，您可能不需要使用此函式庫！請考慮使用 `http.Server` 內建的 [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) 方法來進行優雅關閉。請參閱 gin 的完整[優雅關閉](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown)範例。

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
		c.String(http.StatusOK, "歡迎使用 Gin 伺服器")
	})

	srv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	go func() {
		// 服務連線
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("監聽： %s\n", err)
		}
	}()

	// 等待中斷訊號以優雅地關閉伺服器，並設定 5 秒的超時。
	quit := make(chan os.Signal, 1)
	// kill (不帶參數) 預設傳送 syscall.SIGTERM
	// kill -2 是 syscall.SIGINT
	// kill -9 是 syscall.SIGKILL，但無法被捕捉，因此不需加入
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("正在關閉伺服器...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("伺服器關閉時發生錯誤：", err)
	}

	log.Println("伺服器已退出")
}
```

