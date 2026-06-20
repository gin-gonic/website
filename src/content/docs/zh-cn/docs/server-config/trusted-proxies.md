---
title: "可信代理"
sidebar:
  order: 8
---

Gin 允许你指定哪些请求头包含真实的客户端 IP（如果有的话），以及指定你信任哪些代理（或直接客户端）来设置这些头。

### 为什么可信代理配置很重要

当你的应用位于反向代理（Nginx、HAProxy、云负载均衡器等）后面时，代理会在 `X-Forwarded-For` 或 `X-Real-Ip` 等头中转发原始客户端的 IP 地址。问题在于**任何客户端都可以设置这些头**。如果没有正确的可信代理配置，攻击者可以伪造 `X-Forwarded-For` 来：

- **绕过基于 IP 的访问控制** -- 如果你的应用将某些路由限制在内部 IP 范围内（例如 `10.0.0.0/8`），攻击者可以从公网 IP 发送 `X-Forwarded-For: 10.0.0.1` 来完全绕过限制。
- **污染日志和审计记录** -- 伪造的 IP 使得事件调查不可靠，因为你无法再将请求追溯到真实来源。
- **规避限流** -- 如果限流基于 `ClientIP()`，每个请求都可以声称来自不同的 IP 地址以避免被限流。

`SetTrustedProxies` 通过告诉 Gin 哪些网络地址是合法代理来解决这个问题。当 `ClientIP()` 解析 `X-Forwarded-For` 链时，它只信任由这些代理添加的条目，并丢弃客户端可能添加的任何内容。如果请求直接到达（不是从可信代理），转发头将被完全忽略，直接使用原始远程地址。

使用 `gin.Engine` 上的 `SetTrustedProxies()` 函数来指定网络地址或网络 CIDR，这些地址的客户端发送的与客户端 IP 相关的请求头可以被信任。可以是 IPv4 地址、IPv4 CIDR、IPv6 地址或 IPv6 CIDR。

**注意：** 如果你不使用上述函数指定可信代理，Gin 默认会信任所有代理，**这是不安全的**。同时，如果你不使用任何代理，可以通过 `Engine.SetTrustedProxies(nil)` 禁用此功能，这样 `Context.ClientIP()` 将直接返回远程地址以避免一些不必要的计算。

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // If the client is 192.168.1.2, use the X-Forwarded-For
    // header to deduce the original client IP from the trust-
    // worthy parts of that header.
    // Otherwise, simply return the direct client IP
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**注意：** 如果你正在使用 CDN 服务，可以设置 `Engine.TrustedPlatform` 来跳过 TrustedProxies 检查，它的优先级高于 TrustedProxies。请参阅以下示例：

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Use predefined header gin.PlatformXXX
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // Or, you can set your own trusted request header. But be sure your CDN
  // prevents users from passing this header! For example, if your CDN puts
  // the client IP in X-CDN-Client-IP:
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // If you set TrustedPlatform, ClientIP() will resolve the
    // corresponding header and return IP directly
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
