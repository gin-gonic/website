---
title: "自定义 HTTP 配置"
sidebar:
  order: 1
---

默认情况下，`router.Run()` 启动一个基本的 HTTP 服务器。在生产环境中，你可能需要自定义超时、请求头限制或 TLS 设置。你可以通过创建自己的 `http.Server` 并将 Gin 路由器作为 `Handler` 传入来实现。

## 基本用法

将 Gin 路由器直接传递给 `http.ListenAndServe`：

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

## 使用自定义服务器设置

创建 `http.Server` 结构体来配置读写超时和其他选项：

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

## 测试

```sh
curl http://localhost:8080/ping
# Output: pong
```

## 另请参阅

- [优雅重启或停止](/zh-cn/docs/server-config/graceful-restart-or-stop/)
- [运行多个服务](/zh-cn/docs/server-config/run-multiple-service/)
