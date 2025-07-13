---
title: "优雅地重启或停止"
---

你想优雅地重启或停止 web 服务器吗？有一些方法可以做到这一点。

我们可以使用 [fvbock/endless](https://github.com/fvbock/endless) 来替换默认的 `ListenAndServe`。更多详细信息，请参阅 issue [#296](https://github.com/gin-gonic/gin/issues/296)。

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

替代方案:

* [manners](https://github.com/braintree/manners)：可以优雅关机的 Go Http 服务器。
* [graceful](https://github.com/tylerb/graceful)：Graceful 是一个 Go 扩展包，可以优雅地关闭 http.Handler 服务器。
* [grace](https://github.com/facebookgo/grace)：Go 服务器平滑重启和零停机时间部署。

如果你使用的是 Go 1.8，可以不需要这些库！考虑使用 http.Server 内置的 [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) 方法优雅地关机. 请参阅 gin 完整的 [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) 示例。

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
