---
title: "部署"
draft: false
weight: 6
---

Gin 项目可以轻松部署在任何云提供商上。

## [Render](https://render.com)

Render 是一个原生支持 Go 的现代化云平台，并支持全托管 SSL、数据库、不停机部署、HTTP/2 和 websocket。

参考 Render [Gin 项目部署指南](https://render.com/docs/deploy-go-gin)。

## [Google App Engine](https://cloud.google.com/appengine/)

GAE 提供了两种方式部署 Go 应用。标准环境，简单易用但可定制性较低，且出于安全考虑禁止 [syscalls](https://github.com/gin-gonic/gin/issues/1639)。灵活环境，可以运行任何框架和库。

前往 [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/) 了解更多并选择你喜欢的环境。

## 自托管部署

Gin 项目也可以采用自托管方式部署。具体的部署架构和安全性考虑会根据目标环境而有所不同。以下部分仅提供在规划部署时需要考虑的配置选项的概述。

## 配置选项

Gin 项目的部署可以通过环境变量或直接在代码中进行配置。

以下环境变量可用于配置 Gin：

| 环境变量 | 说明                                                                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT     | 使用 `router.Run()` 启动 Gin 服务器时（即不带任何参数）监听的 TCP 端口。                                                                                                      |
| GIN_MODE | 可设置为 `debug`、`release` 或 `test`。用于管理 Gin 的运行模式，如是否输出调试信息。也可以在代码中使用 `gin.SetMode(gin.ReleaseMode)` 或 `gin.SetMode(gin.TestMode)` 来设置。 |

以下代码可用于配置 Gin：

```go
// 不指定 Gin 的绑定地址和端口。默认绑定所有接口，端口为 8080。
// 使用不带参数的 `Run()` 时，可通过 `PORT` 环境变量更改监听端口。
router := gin.Default()
router.Run()

// 指定 Gin 的绑定地址和端口。
router := gin.Default()
router.Run("192.168.1.100:8080")

// 仅指定监听端口。将绑定所有接口。
router := gin.Default()
router.Run(":8080")

// 设置哪些 IP 地址或 CIDR 被视为可信任的代理，用于设置记录真实客户端 IP 的请求头。
// 更多详情请参阅文档。
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

## 不要信任所有代理

Gin 允许你指定哪些请求头可以保存真实的客户端 IP（如果有的话），以及你信任哪些代理（或直接客户端）可以设置这些请求头。

在你的 `gin.Engine` 上使用 `SetTrustedProxies()` 函数来指定可信任的网络地址或网络 CIDR，这些地址的请求头中与客户端 IP 相关的信息将被信任。它们可以是 IPv4 地址、IPv4 CIDR、IPv6 地址或 IPv6 CIDR。

**注意：** 如果你没有使用上述函数指定可信代理，Gin 默认会信任所有代理，这**并不安全**。同时，如果你不使用任何代理，可以通过 `Engine.SetTrustedProxies(nil)` 来禁用此功能，这样 `Context.ClientIP()` 将直接返回远程地址，避免不必要的计算。

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // 如果客户端是 192.168.1.2，则使用 X-Forwarded-For
    // 请求头中可信部分推断出原始客户端 IP。
    // 否则，直接返回客户端 IP
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**提示：** 如果你使用 CDN 服务，可以设置 `Engine.TrustedPlatform` 来跳过 TrustedProxies 检查，它的优先级高于 TrustedProxies。
请看下面的示例：

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // 使用预定义的 gin.PlatformXXX 头
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // 或者，你可以设置自己的可信请求头。但要确保你的 CDN
  // 能防止用户传递此请求头！例如，如果你的 CDN 将客户端
  // IP 放在 X-CDN-Client-IP 中：
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // 如果设置了 TrustedPlatform，ClientIP() 将解析
    // 对应的请求头并直接返回 IP
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
