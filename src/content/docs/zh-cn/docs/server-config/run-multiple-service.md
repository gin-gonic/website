---
title: "运行多个服务"
sidebar:
  order: 4
---

你可以在同一个进程中运行多个 Gin 服务器——每个服务器在不同的端口上——通过使用 `golang.org/x/sync/errgroup` 包中的 `errgroup.Group`。当你需要暴露不同的 API 时（例如，在端口 8080 上的公共 API 和端口 8081 上的管理 API），这非常有用，无需部署单独的二进制文件。

每个服务器拥有自己的路由器、中间件栈和 `http.Server` 配置。

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "golang.org/x/sync/errgroup"
)

var (
  g errgroup.Group
)

func router01() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 01",
    })
  })

  return e
}

func router02() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 02",
    })
  })

  return e
}

func main() {
  server01 := &http.Server{
    Addr:         ":8080",
    Handler:      router01(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  server02 := &http.Server{
    Addr:         ":8081",
    Handler:      router02(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  g.Go(func() error {
    return server01.ListenAndServe()
  })

  g.Go(func() error {
    return server02.ListenAndServe()
  })

  if err := g.Wait(); err != nil {
    log.Fatal(err)
  }
}
```

## 测试

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
如果任一服务器启动失败（例如端口已被占用），`g.Wait()` 会返回第一个错误。两个服务器都必须成功启动，进程才能继续运行。
:::

## 另请参阅

- [自定义 HTTP 配置](/zh-cn/docs/server-config/custom-http-config/)
- [优雅重启或停止](/zh-cn/docs/server-config/graceful-restart-or-stop/)
