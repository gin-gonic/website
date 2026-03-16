---
title: "支持 Let's Encrypt"
sidebar:
  order: 3
---

[gin-gonic/autotls](https://github.com/gin-gonic/autotls) 包通过 Let's Encrypt 提供自动 HTTPS 功能。它自动处理证书的签发和续期，因此你可以用最少的配置来提供 HTTPS 服务。

## 快速开始

最简单的方式是使用你的路由器和一个或多个域名调用 `autotls.Run`：

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  log.Fatal(autotls.Run(router, "example1.com", "example2.com"))
}
```

## 自定义自动证书管理器

如需更多控制——例如指定证书缓存目录或限制允许的主机名——请使用 `autotls.RunWithManager` 配合自定义的 `autocert.Manager`：

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
  "golang.org/x/crypto/acme/autocert"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  m := autocert.Manager{
    Prompt:     autocert.AcceptTOS,
    HostPolicy: autocert.HostWhitelist("example1.com", "example2.com"),
    Cache:      autocert.DirCache("/var/www/.cache"),
  }

  log.Fatal(autotls.RunWithManager(router, &m))
}
```

:::note
Let's Encrypt 要求你的服务器可以从公共互联网通过端口 80 和 443 访问。这在 localhost 或阻止入站连接的防火墙后面无法工作。
:::

## 另请参阅

- [自定义 HTTP 配置](/zh-cn/docs/server-config/custom-http-config/)
