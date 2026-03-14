---
title: "优雅重启或停止"
sidebar:
  order: 5
---

当服务器进程收到终止信号时（例如在部署或扩缩容事件中），立即关闭会丢弃所有正在进行中的请求，导致客户端连接断开和操作可能损坏。**优雅关闭**通过以下方式解决这个问题：

- **完成进行中的请求** -- 正在处理的请求有时间完成，客户端会收到正确的响应而不是连接重置。
- **排空连接** -- 服务器停止接受新连接，同时允许现有连接完成，防止突然断开。
- **清理资源** -- 数据库连接、文件句柄和后台工作器被正确关闭，避免数据损坏或资源泄漏。
- **实现零停机部署** -- 结合负载均衡器，优雅关闭让你可以发布新版本而不会出现任何用户可见的错误。

在 Go 中有多种方式实现这一点。

我们可以使用 [fvbock/endless](https://github.com/fvbock/endless) 来替换默认的 `ListenAndServe`。参考 issue [#296](https://github.com/gin-gonic/gin/issues/296) 了解更多详情。

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

endless 的替代方案：

* [manners](https://github.com/braintree/manners)：一个优雅关闭的 Go HTTP 服务器。
* [graceful](https://github.com/tylerb/graceful)：一个支持 http.Handler 服务器优雅关闭的 Go 包。
* [grace](https://github.com/facebookgo/grace)：Go 服务器的优雅重启和零停机部署。

如果你使用 Go 1.8 及更高版本，你可能不需要使用这些库！考虑使用 `http.Server` 内置的 [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) 方法进行优雅关闭。查看完整的 [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) gin 示例。

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
